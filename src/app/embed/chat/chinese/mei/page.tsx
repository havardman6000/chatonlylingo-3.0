'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { useChatStore } from '@/store/chatStore';

export default function MeiEmbedPage() {
  const { selectedCharacter, actions } = useChatStore();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Fixed values for this specific tutor
  const tutorId = 'mei';
  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Reset and initialize the chat
        if (!selectedCharacter || selectedCharacter !== tutorId) {
          actions.reset();
          actions.selectCharacter(tutorId);
        }
        
        // Notify parent window that chat is ready
        if (window.self !== window.top) {
          window.parent.postMessage({
            type: 'lingobabe-chat-ready',
            tutorId: tutorId
          }, '*');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, [selectedCharacter, actions]);

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <ChatInterface characterId={tutorId} embedded={true} />;
}