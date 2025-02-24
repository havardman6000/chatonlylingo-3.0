// src/components/ChatInterface/ChatOptions.tsx
import { ChatOption } from '@/types/chat';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
  onPlayAudio: (text: string) => Promise<void>;
  audioPlaying: boolean;
}

export function ChatOptions({ 
  options, 
  onSelectOption, 
  onPlayAudio, 
  audioPlaying 
}: ChatOptionsProps) {
  const getPrimaryText = (option: ChatOption) => {
    return option.chinese ||
           option.japanese ||
           option.korean ||
           option.spanish ||
           option.english;
  };

  const getPronunciation = (option: ChatOption) => {
    return option.pinyin ||
           option.romaji ||
           option.romanized ||
           '';
  };

  const handlePlayAudio = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (!audioPlaying) {
      await onPlayAudio(text);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div
          key={index}
          className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          onClick={() => onSelectOption(option)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectOption(option);
            }
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-1">
              <p className="text-white text-base">
                {getPrimaryText(option)}
              </p>
              {getPronunciation(option) && (
                <p className="text-gray-400 text-sm">
                  {getPronunciation(option)}
                </p>
              )}
              {option.english && (
                <p className="text-gray-400 text-sm">
                  {option.english}
                </p>
              )}
            </div>
            
            <button
              className={`flex-shrink-0 ml-3 w-8 h-8 rounded-full transition-colors flex items-center justify-center
                ${audioPlaying ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={(e) => handlePlayAudio(e, getPrimaryText(option))}
              disabled={audioPlaying}
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
          </div>
        </div>
      ))}
    </div>
  );
}//src/components/ChatInterface/ChatOptions.tsx