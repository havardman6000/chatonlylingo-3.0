// src/components/ChatInterface/ChatHeader.tsx
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  characterName: string;
  happiness: number;
}

export default function ChatHeader({
  characterName,
  happiness
}: ChatHeaderProps) {
  const router = useRouter();

  const getHappinessColor = () => {
    if (happiness >= 80) return 'bg-green-500';
    if (happiness >= 60) return 'bg-blue-500';
    if (happiness >= 40) return 'bg-yellow-500';
    if (happiness >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={() => router.push('/')}
          className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          aria-label="Go back to home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-white">
            {characterName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${getHappinessColor()}`} />
            <span className="text-sm text-gray-400">
              Happiness: {happiness}%
            </span>
          </div>
        </div>

        <div className="w-10" />
      </div>
    </div>
  );
}//src/components/ChatInterface/ChatHeader.tsx