'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import { ChatHeader } from './ChatHeader';
import { ChatCompletionPopup } from '../ChatCompletionPopup';
import { VideoPlayer } from './VideoPlayer';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { CharacterId, ChatOption } from '@/types/chat';

interface ChatInterfaceProps {
  characterId: CharacterId;
}

export default function ChatInterface({ characterId }: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();

  // UI State
  const [showOptions, setShowOptions] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  // Initialize chat
  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat progress to localStorage
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
      // Add user message
      actions.addMessage({
        role: 'user',
        content: option
      });

      // Short delay for natural conversation flow
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add assistant response if available
      if (option.response) {
        actions.addMessage({
          role: 'assistant',
          content: option.response
        });

        // Handle video response
        if (option.response.video) {
          setCurrentVideo(option.response.video);
        }
      }

      // Update happiness if points provided
      if (typeof option.points === 'number') {
        actions.updateHappiness(characterId, option.points);
      }

      // Handle scene progression
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
      setError('Failed to process response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletionClose = () => {
    // Save completion status
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
        language={character.language}
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Video display */}
        {currentVideo && (
          <div className="sticky top-0 z-10 pb-4">
            <VideoPlayer src={currentVideo} />
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={index}
            message={message}
            avatarSrc={character.image}
            language={character.language}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-600 text-white text-center">
          {error}
        </div>
      )}

      {/* Chat options */}
      <div className="p-4">
        {showOptions && currentSceneData?.options && (
          <ChatOptions
            options={currentSceneData.options}
            onSelectOption={handleOptionSelect}
          />
        )}
      </div>

      {/* Completion popup */}
      {showCompletionPopup && character && (
        <ChatCompletionPopup
          language={character.language}
          onClose={handleCompletionClose}
        />
      )}

      {/* Loading indicator */}
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