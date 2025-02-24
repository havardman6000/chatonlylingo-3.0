'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { characters } from '@/data/characters';
import type { CharacterId } from '@/types/chat';

export default function JiChatPage() {
  const router = useRouter();
  const tutorId: CharacterId = 'ji';
  const tutor = characters[tutorId];

  // Validate the tutor exists and matches the language
  useEffect(() => {
    if (!tutor || tutor.language !== 'korean') {
      router.push('/chat/korean');
    }
  }, [tutor, router]);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <ChatInterface characterId={tutorId} />;
}