import React, { forwardRef } from 'react';

interface ControlsProps {
  onStartCatch: () => void;
  onReset: () => void;
  onShowJournal: () => void;
  isBoardFull: boolean;
  isLoading: boolean;
}

export const Controls = forwardRef<HTMLButtonElement, ControlsProps>(
  ({ onStartCatch, onReset, onShowJournal, isBoardFull, isLoading }, ref) => {
    const isAddDisabled = isBoardFull || isLoading;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          ref={ref}
          onClick={onStartCatch}
          disabled={isAddDisabled}
          className={`
            w-full sm:w-auto px-8 py-3 text-xl font-bold text-white rounded-full shadow-lg 
            transition-all duration-300 transform
            bg-gradient-to-r from-pink-500 to-yellow-500 
            hover:scale-105 hover:shadow-xl
            focus:outline-none focus:ring-4 focus:ring-pink-300
            disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:scale-100
          `}
        >
          {isLoading ? '...' : 'Catch a Butterfly 🦋'}
        </button>

        <div className="flex gap-2">
           <button
            onClick={onShowJournal}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-purple-700 bg-purple-200/80 rounded-full
              hover:bg-purple-300/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Royal Journal 📖
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-gray-700 bg-gray-200/80 rounded-full
              hover:bg-gray-300/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
);

Controls.displayName = "Controls";
