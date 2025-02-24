// src/components/ChatInterface/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import ChatHeader from './ChatHeader';
import { VideoPlayer } from './VideoPlayer';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { CharacterId, ChatMessage, ChatOption } from '@/types/chat';

interface ChatInterfaceProps {
  characterId: CharacterId;
}

export default function ChatInterface({ characterId }: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false); // Options are not expanded by default
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || isTransitioning || !character) {
      return;
    }

    setError(null);

    try {
      const selectedOption = currentSceneData?.options.find(opt => {
        const primaryText = opt.chinese || opt.japanese || opt.korean || opt.spanish || opt.english;
        return primaryText === input.trim();
      });

      if (!selectedOption) {
        setError('Please select a valid response option');
        return;
      }

      actions.addMessage({
        role: 'user',
        content: selectedOption
      });

      setInput('');
      setShowOptions(false); // Close options after sending a message

      await new Promise(resolve => setTimeout(resolve, 500));
      if (selectedOption.response) {
        actions.addMessage({
          role: 'assistant',
          content: selectedOption.response
        });

        if (selectedOption.response.video) {
          setCurrentVideo(selectedOption.response.video);
        }

        const primaryResponseText = selectedOption.response.chinese ||
                                    selectedOption.response.japanese ||
                                    selectedOption.response.korean ||
                                    selectedOption.response.spanish ||
                                    selectedOption.response.english;

        if (primaryResponseText) {
          await handlePlayAudio(primaryResponseText);
        }
      }

      if (typeof selectedOption.points === 'number') {
        actions.updateHappiness(characterId, selectedOption.points);
      }

      if (currentScene >= 5) {
        setIsTransitioning(true);
        setTimeout(() => {
          router.push(`/chat/${character.language}`);
        }, 1000);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
        }, 1000);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      setError('Failed to process message');
    }
  };

  // Audio playback functionality
  const handlePlayAudio = async (text: string) => {
    if (audioPlaying) return;

    try {
      setAudioPlaying(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: character?.language || 'chinese'
        }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setAudioPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioPlaying(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionSelect = (option: ChatOption) => {
    const primaryText = option.chinese ||
                       option.japanese ||
                       option.korean ||
                       option.spanish ||
                       option.english;
    setInput(primaryText);
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1b1e]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-[#1a1b1e]">
        <ChatHeader
          characterName={character?.name || ''}
          characterId={characterId}
          happiness={happiness[characterId] || 50}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Initial spacing from header */}
        <div className="pt-20 pb-32"> {/* Increased bottom padding to account for input area */}
          {/* Video Section if present */}
          {currentVideo && (
            <div className="sticky top-16 z-20 bg-[#1a1b1e] mt-2.5 px-4">
              <VideoPlayer src={currentVideo} />
            </div>
          )}

          {/* Messages with correct spacing */}
          <div className={`px-4 ${currentVideo ? 'mt-2.5' : 'mt-2.5'}`}>
            {messages.map((message, index) => (
              <div key={index} className="chat-message-container">
                <ChatMessageComponent
                  message={message as ChatMessage}
                  avatarSrc={character?.image}
                  language={character?.language || 'chinese'}
                  onPlayAudio={handlePlayAudio}
                  audioPlaying={audioPlaying}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1b1e] border-t border-gray-800">
        <div className="p-4">
          {/* Chat Options - Moved above the input */}
          {showOptions && currentSceneData?.options && (
            <div className="mb-4 bg-gray-800/50 rounded-lg p-2">
              <ChatOptions
                options={currentSceneData.options}
                onSelectOption={handleOptionSelect}
                onPlayAudio={handlePlayAudio}
                audioPlaying={audioPlaying}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or select a message..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isTransitioning}
              className={`px-4 py-2 rounded-lg transition-colors ${
                input.trim() && !isTransitioning
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//src/components/ChatInterface/index.tsx