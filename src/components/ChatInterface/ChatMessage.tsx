
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
                ${audioPlaying ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              aria-label={audioPlaying ? "Audio playing" : "Play audio"}
            >
              <svg 
                className="w-5 h-5 text-white" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                {audioPlaying ? (
                  <path d="M16 8a4 4 0 0 1 0 8m4-12a8 8 0 0 1 0 16M6 9v6a1 1 0 0 0 1 1h1l4 4V4L8 8H7a1 1 0 0 0-1 1z" />
                ) : (
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}