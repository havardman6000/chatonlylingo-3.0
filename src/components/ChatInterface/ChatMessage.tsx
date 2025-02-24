import { ChatMessage, SupportedLanguage } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessage;
  avatarSrc?: string;
  language: SupportedLanguage;
}

export function ChatMessageComponent({ message, avatarSrc, language }: ChatMessageProps) {
  const isUserMessage = message.role === 'user';

  const getPrimaryText = () => {
    const content = message.content;
    return content[language] || content.english;
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

      <div 
        className={`relative max-w-[80%] px-4 py-3 rounded-lg 
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
            
            {message.content.context && (
              <p className="text-sm italic text-gray-400 mt-2">
                {message.content.context}
              </p>
            )}
          </div>

          {!isUserMessage && (
            <button 
              className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Audio functionality handled by parent
              }}
            >
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}