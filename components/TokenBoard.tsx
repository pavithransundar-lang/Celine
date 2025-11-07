import React from 'react';
import { Stage } from '../types';
import { ButterflyToken } from './ButterflyToken';

interface TokenBoardProps {
  stages: Stage[];
  earnedTokens: number;
  slotRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

// FIX: Defined the missing PathSegmentProps interface to resolve the TypeScript error.
interface PathSegmentProps {
  isFilled: boolean;
}

const PathSegment: React.FC<PathSegmentProps> = ({ isFilled }) => (
  <div className="relative flex-1 h-1.5 bg-pink-200/70 rounded-full mx-1 shadow-inner">
    {/* The animated filling part of the path */}
    <div 
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 rounded-full transition-all duration-1000 ease-out delay-300"
      style={{ width: isFilled ? '100%' : '0%' }}
    />
  </div>
);

const Castle: React.FC<{ isReached: boolean }> = ({ isReached }) => (
  <div className={`text-6xl md:text-7xl transition-transform duration-500 ${isReached ? 'scale-110 animate-castle-shimmer' : 'scale-90 opacity-70'}`}>
    🏰
  </div>
);

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute bottom-full mb-3 px-3 py-2 w-max max-w-[220px] text-center text-sm font-semibold text-white bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out pointer-events-none z-10 origin-bottom">
    {text}
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-purple-600" />
  </div>
);


export const TokenBoard: React.FC<TokenBoardProps> = ({ stages, earnedTokens, slotRefs }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 md:px-4 py-4">
      {stages.slice(0, -1).map((stage, index) => (
        <React.Fragment key={stage.name}>
          <div className="relative flex flex-col items-center text-center group w-24">
            <Tooltip text={stage.tooltip} />
            <div 
              ref={el => { if(slotRefs.current) slotRefs.current[index] = el; }}
              className={`relative w-16 h-16 md:w-20 md:h-20 bg-white/80 border-4 rounded-full flex items-center justify-center transition-all duration-500 group-hover:border-purple-400 group-hover:scale-105 shadow-lg ${
                earnedTokens > index ? 'border-pink-500' : 'border-purple-300'
              }`}>
              {earnedTokens > index ? (
                <div key={`token-${index}`} className="animate-token-appear">
                  <ButterflyToken />
                </div>
              ) : (
                <span key={`emoji-${index}`} className="text-3xl md:text-4xl">{stage.emoji}</span>
              )}
            </div>
            <span className={`mt-2 text-sm md:text-base font-bold transition-colors duration-500 ${earnedTokens > index ? 'text-purple-700' : 'text-gray-500'}`}>
              {stage.name}
            </span>
          </div>
          <PathSegment isFilled={earnedTokens > index} />
        </React.Fragment>
      ))}
      <div className="relative flex flex-col items-center text-center group w-24">
        <Tooltip text={stages[stages.length - 1].tooltip} />
         <div 
            ref={el => { if(slotRefs.current) slotRefs.current[stages.length - 1] = el; }}
            className="relative w-16 h-16 md:w-20 md:h-20 bg-white/80 border-4 border-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg">
            <Castle isReached={earnedTokens === stages.length} />
         </div>
        <span className={`mt-2 text-sm md:text-base font-bold transition-colors ${earnedTokens === stages.length ? 'text-yellow-600' : 'text-gray-500'}`}>
          {stages[stages.length-1].name}
        </span>
      </div>
    </div>
  );
};