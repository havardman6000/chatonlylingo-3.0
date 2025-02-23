// src/types/chat.ts

export type SupportedLanguage = 'chinese' | 'japanese' | 'korean' | 'spanish' | 'english';
export type ChatRole = 'user' | 'assistant';

export type CharacterId =
  | 'mei' | 'ting' | 'xue'
  | 'aoi' | 'aya' | 'misa'
  | 'ji' | 'min' | 'sua'
  | 'isabella' | 'sofia' | 'valentina';

export interface MessageContent {
  english: string;
  chinese?: string;
  pinyin?: string;
  japanese?: string;
  romaji?: string;
  korean?: string;
  romanized?: string;
  spanish?: string;
  context?: string;
  video?: string;
}

export interface ChatMessage {
  role: ChatRole;
  content: MessageContent;
  timestamp?: number;
}

export interface ChatOption {
  id?: string;
  english: string;
  chinese?: string;
  pinyin?: string;
  japanese?: string;
  romaji?: string;
  korean?: string;
  romanized?: string;
  spanish?: string;
  response?: MessageContent;
  points?: number;
  video?: string;
  context?: string;
}

export interface ChatHeaderProps {
  characterName: string;
  characterId: CharacterId;
  happiness: number;
  language: SupportedLanguage;
  onBack?: () => void;
}

export interface ChatMessageProps {
  message: ChatMessage;
  avatarSrc?: string;
  language: SupportedLanguage;
  onPlayAudio: (text: string) => Promise<void>; // Add onPlayAudio
  audioPlaying: boolean; // Add audioPlaying
}

export interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
  onPlayAudio: (text: string) => Promise<void>; // Add onPlayAudio
  audioPlaying: boolean; // Add audioPlaying
}

export interface Scene {
  initial: MessageContent;
  options: ChatOption[];
  video?: string;
  transition?: string;
}

export interface Character {
  id: CharacterId;
  name: string;
  description: string;
  language: SupportedLanguage;
  image: string;
  scenes: Record<number, Scene>;
  chineseName?: string;
  japaneseName?: string;
  koreanName?: string;
  spanishName?: string;
}

export type Characters = Record<CharacterId, Character>;