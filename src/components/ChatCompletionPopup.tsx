import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatCompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  tutorName: string;
}

export function ChatCompletionPopup({ isOpen, onClose, language, tutorName }: ChatCompletionPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white max-w-md mx-auto p-6 rounded-xl">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Thank You Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">
              Thank you for chatting with {tutorName}!
            </h2>
            <p className="text-gray-300">
              We hope you enjoyed your conversation and learned something new.
              Looking forward to seeing you again soon!
            </p>
          </div>

          {/* Interactive Elements */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => {
                router.push(`/chat/${language}`);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium"
            >
              Return to {language.charAt(0).toUpperCase() + language.slice(1)} Tutors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}