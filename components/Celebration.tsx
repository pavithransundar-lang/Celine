import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// A simple hook to get window dimensions
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

const Celebration: React.FC = () => {
  const { width, height } = useWindowSize();
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    // In App.tsx, the celebration state lasts for 8 seconds.
    // We'll stop creating new confetti particles after 5 seconds
    // to allow the existing ones to fall gracefully off the screen.
    const timer = setTimeout(() => {
      setRecycle(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Confetti
      width={width}
      height={height}
      recycle={recycle}
      numberOfPieces={400}
      gravity={0.12}
      colors={['#fecdd3', '#e9d5ff', '#a5b4fc', '#fde047', '#ec4899']}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none' }}
    />
  );
};

export default Celebration;
