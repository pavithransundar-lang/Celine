export interface Stage {
  name: string;
  emoji: string;
  tooltip: string;
}

export interface JournalEntry {
  date: string;
  q1: string; // The question
  a1: string; // The answer
  q2: string; // The question
  a2: string; // The answer
  reflection: string; // Gemini's reflection
}

export type Mood = 'happy' | 'neutral' | 'sad';
