import { ChatOption } from '@/types/chat';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
  onPlayAudio: (text: string) => Promise<void>;
  audioPlaying: boolean;
}

export function ChatOptions({ options, onSelectOption, onPlayAudio, audioPlaying }: ChatOptionsProps) {
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

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const primaryText = getPrimaryText(option);
        const pronunciationText = getPronunciation(option);

        return (
          <div
            key={index}
            className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
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
              <div className="flex-1">
                <p className="text-white text-base">{primaryText}</p>
                {pronunciationText && (
                  <p className="text-gray-400 text-sm">{pronunciationText}</p>
                )}
                {option.english && primaryText !== option.english && (
                  <p className="text-gray-400 text-sm">{option.english}</p>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(primaryText);
                }}
                disabled={audioPlaying}
                className={`flex-shrink-0 w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                  audioPlaying ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}