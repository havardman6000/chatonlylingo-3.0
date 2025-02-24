import React from 'react';
import type { ChatMessageProps } from '@/types/chat';

export function ChatMessageComponent({
  message,
  avatarSrc,
  language,
  onPlayAudio,
  audioPlaying
}: ChatMessageProps) {
  const isUserMessage = message.role === 'user';

  const getPrimaryText = () => {
    const content = message.content;
    switch (language) {
      case 'chinese':
        return content.chinese || content.english;
      case 'japanese':
        return content.japanese || content.english;
      case 'korean':
        return content.korean || content.english;
      case 'spanish':
        return content.spanish || content.english;
      default:
        return content.english;
    }
  };

  const getPronunciation = () => {
    const content = message.content;
    switch (language) {
      case 'chinese':
        return content.pinyin;
      case 'japanese':
        return content.romaji;
      case 'korean':
        return content.romanized;
      default:
        return null;
    }
  };

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioPlaying) {
      onPlayAudio(getPrimaryText());
    }
  };

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUserMessage && avatarSrc && (
        <div className="flex-shrink-0 mr-3">
          <img
            src={avatarSrc}
            alt="Tutor"
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}

      <div className={`relative max-w-[80%] px-4 py-3 rounded-lg 
        ${isUserMessage ? 'bg-green-600' : 'bg-gray-700'} text-white`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-base">{getPrimaryText()}</p>
            
            {getPronunciation() && (
              <p className="text-sm text-gray-300 mt-1">
                {getPronunciation()}
              </p>
            )}
            
            {message.content.english && language !== 'english' && !isUserMessage && (
              <p className="text-sm text-gray-300 mt-1">
                {message.content.english}
              </p>
            )}
          </div>

          {!isUserMessage && (
            <button 
              onClick={handleAudioPlay}
              disabled={audioPlaying}
              className={`flex-shrink-0 w-8 h-8 rounded-full transition-colors flex items-center justify-center
                ${audioPlaying ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
              aria-label={audioPlaying ? "Audio playing" : "Play audio"}
            >
              <svg 
                className="w-4 h-4 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                {audioPlaying ? (
                  <path d="M10 15V9l5 3-5 3z"/>
                ) : (
                  <path d="M8 5v14l11-7z"/>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}//src/components/ChatInterface/ChatMessage.tsx