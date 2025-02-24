'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import ChatHeader from './ChatHeader';
import { ChatCompletionPopup } from '../ChatCompletionPopup';
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
  const [showOptions, setShowOptions] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  // Initialize chat
  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPrimaryText = (option: ChatOption) => {
    return option.chinese ||
           option.japanese ||
           option.korean ||
           option.spanish ||
           option.english;
  };

  const handleOptionSelect = (option: ChatOption) => {
    setInput(getPrimaryText(option));
    setShowOptions(false);
  };

  const handleSend = async () => {
    if (isTransitioning || !input.trim()) return;
    setError(null);

    try {
      const selectedOption = currentSceneData?.options.find(opt => 
        getPrimaryText(opt) === input.trim()
      );

      if (!selectedOption) {
        setError('Please select a valid response option');
        return;
      }

      // Add user message
      actions.addMessage({
        role: 'user',
        content: selectedOption
      });

      setInput('');

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add assistant response if available
      if (selectedOption.response) {
        actions.addMessage({
          role: 'assistant',
          content: selectedOption.response
        });

        if (selectedOption.response.video) {
          setCurrentVideo(selectedOption.response.video);
        }
      }

      // Update happiness if points provided
      if (typeof selectedOption.points === 'number') {
        actions.updateHappiness(characterId, selectedOption.points);
      }

      // Handle scene transition
      if (currentScene >= 5) {
        setShowCompletionPopup(true);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
          setShowOptions(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to process response:', error);
      setError('Failed to process response');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1b1e]">
      <ChatHeader
  characterName={character?.name || ''}
  characterId={characterId}
  happiness={happiness[characterId] || 50}
/>

      <div className="flex-1 relative">
        {/* Video Container */}
        {currentVideo && (
          <div className="sticky top-0 z-10 w-full bg-black/50">
            <div className="max-w-lg mx-auto p-2">
              <VideoPlayer src={currentVideo} />
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4">
          {messages.map((message, index) => (
            <ChatMessageComponent
              key={index}
              message={message as ChatMessage}
              avatarSrc={character?.image}
              language={character?.language || 'chinese'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600/90 text-white text-center py-2 px-4">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-[#1a1b1e]">
        <div className="p-4 space-y-4">
          {showOptions && currentSceneData?.options && (
            <ChatOptions
              options={currentSceneData.options}
              onSelectOption={handleOptionSelect}
            />
          )}

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

      {/* Completion Popup */}
      {showCompletionPopup && character && (
        <ChatCompletionPopup
          language={character.language}
          onClose={() => {
            setShowCompletionPopup(false);
            router.push(`/chat/${character.language}`);
          }}
        />
      )}
    </div>
  );
}