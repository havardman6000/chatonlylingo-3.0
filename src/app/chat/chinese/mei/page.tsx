'use client'

import ChatInterface from '@/components/ChatInterface' // Changed to default import
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useChatStore } from '@/store/chatStore'

export default function MeiChatPage() {
  const router = useRouter()
  const { selectedCharacter, actions } = useChatStore()
  const tutorId = 'mei'
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!selectedCharacter || selectedCharacter !== tutorId) {
          console.log('Initializing chat with tutor:', tutorId)
          actions.reset()
          actions.selectCharacter(tutorId)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeChat()
  }, [selectedCharacter, tutorId, actions])

  const handleBack = () => {
    router.push('/chat/chinese')
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Initializing...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ChatInterface characterId={tutorId} />
    </div>
  )
}
//src/app/chat/chinese/mei/page.tsx