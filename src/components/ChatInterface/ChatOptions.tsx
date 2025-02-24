import { ChatOption } from '@/types/chat';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
}

export function ChatOptions({ options, onSelectOption }: ChatOptionsProps) {
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
            
            <div className="flex-shrink-0 ml-3">
              <div
                className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Audio functionality handled by parent component
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    // Audio functionality handled by parent component
                  }
                }}
              >
                <svg 
                  className="w-3 h-3 text-white" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}//src/components/ChatInterface/ChatOptions.tsx