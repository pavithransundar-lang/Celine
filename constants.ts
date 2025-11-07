
import { Stage } from './types';

export const DEFAULT_STAGES: Stage[] = [
  { 
    name: "Butterfly Garden", 
    emoji: "🦋",
    tooltip: "You found your first butterfly! Let’s keep reading to earn more!",
  },
  { 
    name: "Magic Forest", 
    emoji: "🌳",
    tooltip: "Answer your ‘who’ and ‘what’ questions to move through the forest!",
  },
  { 
    name: "Crystal Bridge", 
    emoji: "💎",
    tooltip: "Retell your story with two details to cross the bridge!",
  },
  { 
    name: "Royal Gate", 
    emoji: "🔑",
    tooltip: "Use your magic words: ‘I think… because…’ to unlock the gate!",
  },
  { 
    name: "Princess Castle", 
    emoji: "🏰",
    tooltip: "You did it, Princess Celine! You’re the Queen of Reading!",
  },
];

export const FALLBACK_MESSAGES: string[] = [
  "You helped the butterfly fly!",
  "Great job, keep going!",
  "What a fantastic reader!",
  "Almost at the castle!",
  "You're a reading superstar, Celine!",
  "Amazing retelling!",
  "Wow, you are so smart!",
  "Queen of Retell!",
];
