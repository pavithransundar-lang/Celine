import React, { useEffect, useRef, useState } from 'react';

interface ARViewProps {
  onCatch: () => void;
  onClose: () => void;
}

// Define the structure for a butterfly's style
interface ButterflyStyle {
  id: string;
  grad1: { from: string; to: string };
  grad2: { from: string; to: string };
}

// Create a pool of different butterfly designs
const BUTTERFLY_STYLES: ButterflyStyle[] = [
  // Original Pink/Purple
  {
    id: 'pink-purple',
    grad1: { from: 'rgb(255, 105, 180)', to: 'rgb(236, 72, 153)' },
    grad2: { from: 'rgb(192, 132, 252)', to: 'rgb(168, 85, 247)' },
  },
  // Blue/Green
  {
    id: 'blue-green',
    grad1: { from: 'rgb(56, 189, 248)', to: 'rgb(34, 197, 94)' },
    grad2: { from: 'rgb(74, 222, 128)', to: 'rgb(163, 230, 53)' },
  },
  // Orange/Yellow
  {
    id: 'orange-yellow',
    grad1: { from: 'rgb(251, 146, 60)', to: 'rgb(249, 115, 22)' },
    grad2: { from: 'rgb(253, 224, 71)', to: 'rgb(234, 179, 8)' },
  },
  // Teal/Cyan
  {
    id: 'teal-cyan',
    grad1: { from: 'rgb(45, 212, 191)', to: 'rgb(20, 184, 166)' },
    grad2: { from: 'rgb(34, 211, 238)', to: 'rgb(103, 232, 249)' },
  },
  // Indigo/Violet
  {
    id: 'indigo-violet',
    grad1: { from: 'rgb(129, 140, 248)', to: 'rgb(99, 102, 241)' },
    grad2: { from: 'rgb(167, 139, 250)', to: 'rgb(139, 92, 246)' },
  },
];

// Helper to shuffle an array
const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

// Update Butterfly component to accept a style prop
const Butterfly: React.FC<{ onClick: () => void, style: React.CSSProperties, isCaught: boolean, butterflyStyle: ButterflyStyle }> = ({ onClick, style, isCaught, butterflyStyle }) => (
  <div onClick={onClick} style={style} className={`ar-butterfly ${isCaught ? 'caught' : ''}`}>
    <svg viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Use unique IDs for gradients to prevent conflicts */}
        <linearGradient id={`grad1-${butterflyStyle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: butterflyStyle.grad1.from, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: butterflyStyle.grad1.to, stopOpacity: 1}} />
        </linearGradient>
         <linearGradient id={`grad2-${butterflyStyle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: butterflyStyle.grad2.from, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: butterflyStyle.grad2.to, stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <path className="wing wing-left" d="M20.66 42.4C10.76 36.7 5.7 26.68 7.36 16.59 9.38 4.3 20.34-1.9 31.9-.92c11.56.98 20.78 9.3 23.09 20.65.9 4.38.2 8.87-2.1 12.87L20.66 42.4z" fill={`url(#grad1-${butterflyStyle.id})`} />
      <path className="wing wing-right" d="M79.34 42.4c9.9-5.7 14.96-15.72 13.3-25.81-1.93-12.29-12.89-18.5-24.45-17.52-11.56.98-20.78 9.3-23.09 20.65-.9 4.38-.2 8.87 2.1 12.87l32.14 9.81z" fill={`url(#grad2-${butterflyStyle.id})`} />
      <path d="M48.21 44.49c-3.1-4.7-4.1-10.4-2.6-15.8l-1.9.6c-1.6 5.8-.5 11.9 2.8 17l1.7-1.8z" fill="#4a044e" />
    </svg>
  </div>
);

// Define the state for a single butterfly
interface ButterflyState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  caught: boolean;
  style: ButterflyStyle;
  // New properties for more dynamic movement
  speedModifier: number;
  timeToNextTurn: number; // A countdown in frames
}

const MAX_BUTTERFLIES = 8;

export const ARView: React.FC<ARViewProps> = ({ onCatch, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Initialize state with a function to ensure random butterflies are chosen only once per mount
  const [butterflies, setButterflies] = useState<ButterflyState[]>(() => {
    const shuffledStyles = shuffleArray(BUTTERFLY_STYLES);
    const initialButterflies: ButterflyState[] = [];
    
    for (let i = 0; i < MAX_BUTTERFLIES; i++) {
        initialButterflies.push({
            id: i,
            // Start away from the edges
            x: Math.random() * 70 + 15,
            y: Math.random() * 70 + 15,
            // Random initial direction
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            caught: false,
            // Cycle through styles if more butterflies than styles
            style: shuffledStyles[i % shuffledStyles.length],
            // Varied speed
            speedModifier: Math.random() * 0.5 + 0.75, // 0.75x to 1.25x speed
            // Random time until first turn
            timeToNextTurn: Math.random() * 150 + 50,
        });
    }
    return initialButterflies;
  });

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
        alert("Camera access is needed to catch butterflies! Please allow access and try again.");
        onClose();
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  useEffect(() => {
    const interval = setInterval(() => {
      setButterflies(prev => prev.map(b => {
        if (b.caught) return b;
        
        let newX = b.x + b.vx * b.speedModifier;
        let newY = b.y + b.vy * b.speedModifier;
        let newVx = b.vx;
        let newVy = b.vy;
        let newTimeToNextTurn = b.timeToNextTurn - 1;

        // Bounce off walls with a margin
        if (newX < 5 || newX > 85) {
            newVx = -newVx;
            // Ensure it's inside bounds after bouncing
            newX = Math.max(5.1, Math.min(84.9, newX)); 
        }
        if (newY < 5 || newY > 85) {
            newVy = -newVy;
            newY = Math.max(5.1, Math.min(84.9, newY));
        }

        // Time to pick a new direction?
        if (newTimeToNextTurn <= 0) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = 0.8 + Math.random() * 0.5; // Randomize base speed
            newVx = Math.cos(angle) * speed;
            newVy = Math.sin(angle) * speed;
            newTimeToNextTurn = Math.random() * 100 + 100; // Reset timer (5 to 10 seconds at 50ms interval)
        }
        
        return { 
            ...b, 
            x: newX, 
            y: newY, 
            vx: newVx, 
            vy: newVy, 
            timeToNextTurn: newTimeToNextTurn 
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleCatch = (id: number) => {
    // Prevent catching multiple butterflies
    if (butterflies.some(b => b.caught)) return;
    
    setButterflies(butterflies.map(b => b.id === id ? { ...b, caught: true } : b));
    setTimeout(() => {
        onCatch();
    }, 500); // Wait for catch animation
  };

  return (
    <div className="ar-container">
      <video ref={videoRef} autoPlay playsInline className="ar-video" />
      <div className="ar-overlay">
        {butterflies.map(b => (
          <Butterfly 
            key={b.id}
            isCaught={b.caught}
            onClick={() => handleCatch(b.id)}
            style={{ top: `${b.y}%`, left: `${b.x}%` }}
            butterflyStyle={b.style}
          />
        ))}
      </div>
       <div className="absolute top-5 text-center w-full">
        <p className="text-white text-2xl font-bold bg-black/30 px-4 py-2 rounded-lg">Tap a butterfly to catch it!</p>
      </div>
      <button onClick={onClose} className="ar-close-button">X</button>
    </div>
  );
};