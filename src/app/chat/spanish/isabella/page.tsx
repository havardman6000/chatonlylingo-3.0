'use client'
// src/app/chat/spanish/isabella/page.tsx

import ChatInterface from '@/components/ChatInterface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'

export default function IsabellaChatPage() {
  const router = useRouter()
  const { selectedCharacter, actions } = useChatStore()
  const tutorId = 'isabella' // Hardcoded tutor ID for Isabella

  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== tutorId) {
      console.log('Initializing chat with tutor:', tutorId)
      actions.reset()
      actions.selectCharacter(tutorId)
    }
  }, [selectedCharacter, tutorId, actions, router])

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <ChatInterface characterId={tutorId} />
    </div>
  )
}