import React from 'react';
import { Mood } from '../types';

interface MoodSelectorProps {
  onSelectMood: (mood: Mood) => void;
}

const moods: { mood: Mood; emoji: string; label: string }[] = [
  { mood: 'happy', emoji: '😊', label: 'Happy & Ready!' },
  { mood: 'neutral', emoji: '😐', label: 'Feeling Okay' },
  { mood: 'sad', emoji: '😢', label: 'A Bit Tired' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood }) => {
  return (
    <div className="mood-modal-backdrop">
      <div className="mood-modal-content">
        <h2 className="text-3xl font-bold text-purple-700">How are you feeling today, Princess Celine?</h2>
        <div className="mood-options">
          {moods.map(({ mood, emoji, label }) => (
            <div 
              key={mood} 
              className="mood-option" 
              onClick={() => onSelectMood(mood)}
              role="button"
              aria-label={`Select mood: ${label}`}
            >
              <span aria-hidden="true">{emoji}</span>
              <p className="mt-2 font-semibold text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
