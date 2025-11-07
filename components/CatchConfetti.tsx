import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// A simple hook to get window dimensions, copied from Celebration.tsx
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

interface CatchConfettiProps {
    onComplete: () => void;
}

const CatchConfetti: React.FC<CatchConfettiProps> = ({ onComplete }) => {
  const { width, height } = useWindowSize();

  // The confetti library component calls this function when it's done.
  const handleComplete = () => {
    // A small delay before calling onComplete to ensure all particles have faded.
    setTimeout(() => {
        if (onComplete) {
            onComplete();
        }
    }, 500);
  };
  
  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={150}
      gravity={0.2}
      onConfettiComplete={handleComplete}
      colors={['#fecdd3', '#e9d5ff', '#a5b4fc', '#fde047', '#ec4899']}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none' }}
    />
  );
};

export default CatchConfetti;
