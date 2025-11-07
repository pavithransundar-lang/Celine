
import React from 'react';

interface MessageDisplayProps {
  isLoading: boolean;
  message: string;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ isLoading, message }) => {
  return (
    <div className="mt-6 text-center h-16 flex items-center justify-center">
      <div className="relative p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl shadow-md min-w-[280px] max-w-lg mx-auto">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</div>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse [animation-delay:0.4s]"></div>
            <span className="text-purple-700 italic">Thinking of a magical message...</span>
          </div>
        ) : (
          <p className="text-lg font-semibold text-purple-800 italic">
            "{message}"
          </p>
        )}
      </div>
    </div>
  );
};
