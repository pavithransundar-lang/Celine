
import React from 'react';

export const ButterflyToken: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="w-12 h-12 md:w-16 md:h-16 text-pink-500 animate-pulse-slow"
    style={{
      animation: 'pulse-slow 3s infinite ease-in-out, butterfly-float 5s infinite ease-in-out',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
    }}
  >
    <defs>
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes butterfly-float {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
          }
        `}
      </style>
      <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#ec4899', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#d946ef', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path fill="url(#wingGradient)" stroke="#c026d3" strokeWidth="0.5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.88V18h2v-1.12c2.13-.5 3.88-2.25 4.38-4.38H18v-2h-1.12c-.5-2.13-2.25-3.88-4.38-4.38V6h-2v1.12C8.37 7.62 6.62 9.37 6.12 11.5H5v2h1.12c.5 2.13 2.25 3.88 4.38 4.38z"/>
    <path fill="#fdf2f8" d="M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0"/>
  </svg>
);
