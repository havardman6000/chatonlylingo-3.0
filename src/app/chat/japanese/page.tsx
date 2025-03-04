'use client'

import { BackButton } from '@/components/BackButton';
import { TutorSelect } from '@/components/TutorSelect';

export default function JapaneseTutorPage() {
  const disabledTutors = ['Aya', 'Misa'];

  return (
    <main className="min-h-screen bg-gradient-to-r from-red-50 to-pink-100 py-12">
      <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Japanese Tutor
          </h1>
          <p className="text-2xl text-gray-600">
            Select a tutor to begin your Japanese learning journey
          </p>
        </div>
        <TutorSelect language="japanese" disabledTutors={disabledTutors} />
      </div>
    </main>
  );
}