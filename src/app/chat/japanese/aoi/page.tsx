'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { CharacterId } from '@/types/chat';

export default function AoiChatPage() {
  const router = useRouter();
  const { selectedCharacter, actions } = useChatStore();
  const tutorId: CharacterId = 'aoi';
  const tutor = characters[tutorId];

  useEffect(() => {
    if (!tutor || tutor.language !== 'japanese') {
      router.push('/chat/japanese');
      return;
    }

    if (!selectedCharacter || selectedCharacter !== tutorId) {
      actions.reset();
      actions.selectCharacter(tutorId);
    }
  }, [selectedCharacter, tutorId, actions, router, tutor]);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <ChatInterface characterId={tutorId} />;
}