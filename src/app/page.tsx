'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const languages = [
  { id: 'chinese', name: 'Chinese', native: '中文', image: '/tutors/chinese.png' },
  { id: 'japanese', name: 'Japanese', native: '日本語', image: '/tutors/japanese.png' },
  { id: 'korean', name: 'Korean', native: '한国語', image: '/tutors/korean.png' },
  { id: 'spanish', name: 'Spanish', native: 'Español', image: '/tutors/spanish.png' }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    router.push(`/chat/${languageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-4">
          Welcome to Lingobabe AI
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12">
          Choose your language and start chatting with our AI tutors
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageSelect(lang.id)}
              className={`relative overflow-hidden rounded-xl backdrop-blur-sm 
                transition-all p-6 text-left group
                ${selectedLanguage === lang.id ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900">{lang.name}</h2>
                <p className="text-xl text-gray-700">{lang.native}</p>
              </div>
              
              {lang.image && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={lang.image}
                    alt={lang.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}