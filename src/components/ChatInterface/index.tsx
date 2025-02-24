import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import { ChatHeader } from './ChatHeader';
import { ChatCompletionPopup } from '../ChatCompletionPopup';
import { VideoPlayer } from './VideoPlayer';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { CharacterId, ChatMessage, ChatOption } from '@/types/chat';
import chatService from '@/services/chatService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChatInterface({ characterId }: { characterId: CharacterId }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (characterId && currentScene) {
      localStorage.setItem(`chat_progress_${characterId}`, JSON.stringify({
        currentScene,
        happiness: happiness[characterId],
        lastUpdated: Date.now()
      }));
    }
  }, [characterId, currentScene, happiness]);

  const handleOptionSelect = async (option: ChatOption) => {
    if (isTransitioning || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      actions.addMessage({
        role: 'user',
        content: option
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      if (option.response) {
        actions.addMessage({
          role: 'assistant',
          content: option.response
        });

        if (option.response.video) {
          setCurrentVideo(option.response.video);
        }
      }

      if (typeof option.points === 'number') {
        actions.updateHappiness(characterId, option.points);
      }

      if (currentScene >= 5) {
        setShowCompletionPopup(true);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
        }, 1000);
      }
    } catch (error) {
      setError('Failed to process response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletionClose = () => {
    if (characterId) {
      localStorage.setItem(`chat_completed_${characterId}`, 'true');
    }
    setShowCompletionPopup(false);
    router.push(`/chat/${character?.language}`);
  };

  const handleBack = () => {
    if (character?.language) {
      router.push(`/chat/${character.language}`);
    }
  };

  const onPlayAudio = async (text: string) => {
    setAudioPlaying(true);
    try {
      const audioUrl = await chatService.generateAudio(text, character.language);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => setAudioPlaying(false);
      } else {
        console.error('Audio URL is null');
        setAudioPlaying(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioPlaying(false);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.processMessage(userInput, characterId, currentScene);
      actions.addMessage({
        role: 'user',
        content: { english: userInput }
      });

      if (response.type === 'success') {
        actions.addMessage({
          role: 'assistant',
          content: response.content.message
        });

        if (response.content.video) {
          setCurrentVideo(response.content.video);
        }

        if (typeof response.content.points === 'number') {
          actions.updateHappiness(characterId, response.content.points);
        }

        if (response.content.nextScene !== currentScene) {
          setIsTransitioning(true);
          setTimeout(() => {
            actions.setScene(response.content.nextScene);
            setIsTransitioning(false);
          }, 1000);
        }
      }
    } catch (error) {
      setError('Failed to process response. Please try again.');
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <ChatHeader
        characterName={character.name}
        characterId={characterId}
        happiness={happiness[characterId] || 50}
        onBack={handleBack}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentVideo && (
          <div className="sticky top-0 z-10 pb-4">
            <VideoPlayer src={currentVideo} />
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={index}
            message={message as ChatMessage}
            language={character.language}
            avatarSrc={character.image}
            onPlayAudio={onPlayAudio}
            audioPlaying={audioPlaying}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="px-4 py-2 bg-red-600 text-white text-center">
          {error}
        </div>
      )}
      <div className="p-4 flex flex-col items-center relative">
        {currentSceneData?.options && (
          <div className="w-full max-w-lg mb-4">
            <ChatOptions
              options={currentSceneData.options}
              onSelectOption={handleOptionSelect}
              onPlayAudio={onPlayAudio}
              audioPlaying={audioPlaying}
            />
          </div>
        )}
        <div className="flex items-center space-x-2 w-full">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          >
            <img src="/path-to-second-image-logo.png" alt="Send" className="w-6 h-6 mr-2" />
            Send
          </Button>
        </div>
      </div>
      {showCompletionPopup && character && (
        <ChatCompletionPopup
          language={character.language}
          onClose={handleCompletionClose}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 rounded-full p-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
// src/components/ChatInterface/index.tsx