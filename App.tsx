import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TokenBoard } from './components/TokenBoard';
import { getMotivationalMessage } from './services/geminiService';
import { DEFAULT_STAGES, FALLBACK_MESSAGES } from './constants';
import { Stage, Mood } from './types';
import { MessageDisplay } from './components/MessageDisplay';
import { Controls } from './components/Controls';
import Celebration from './components/Celebration';
import CatchConfetti from './components/CatchConfetti';
import { initAudio, playMessageSound, playMilestoneSound, playResetSound, playTokenSound } from './services/soundService';
import { FlyingButterfly } from './components/FlyingButterfly';
import { ARView } from './components/ARView';
import { JournalModal } from './components/JournalModal';
import { MoodSelector } from './components/MoodSelector';

const getMoodClass = (mood: Mood | null): string => {
  if (!mood) return 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'; // Default
  const moodClasses: Record<Mood, string> = {
    happy: 'mood-happy-bg',
    neutral: 'mood-neutral-bg',
    sad: 'mood-sad-bg',
  };
  return moodClasses[mood];
};


const App: React.FC = () => {
  const [earnedTokens, setEarnedTokens] = useState<number>(0);
  const [stages] = useState<Stage[]>(DEFAULT_STAGES);
  const [message, setMessage] = useState<string>("Let's start our reading quest, Princess Celine!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState<boolean>(false);

  // New features state
  const [isARViewOpen, setIsARViewOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [journalMode, setJournalMode] = useState<'read' | 'write'>('write');
  const [mood, setMood] = useState<Mood | null>(null);
  const [showCatchConfetti, setShowCatchConfetti] = useState<boolean>(false);

  // State for flight animation
  const [isAnimatingToken, setIsAnimatingToken] = useState<boolean>(false);
  const [flyingTarget, setFlyingTarget] = useState<{ from: DOMRect; to: DOMRect } | null>(null);
  const [flyingButterflyKey, setFlyingButterflyKey] = useState(0);

  const maxTokens = stages.length;

  const tokenSlotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addTokenAndGetMessage = useCallback(async (startRect?: DOMRect) => {
    if (earnedTokens >= maxTokens || isLoading || isAnimatingToken || !mood) return;

    const endElement = tokenSlotRefs.current[earnedTokens];
    const endRect = endElement?.getBoundingClientRect();

    if (!startRect || !endElement || !endRect) {
      console.warn("Animation refs not ready, skipping animation.");
      // Fallback for safety, though less likely with the new flow
      setEarnedTokens(prev => prev + 1);
      return;
    }
    
    // Start animation
    setIsAnimatingToken(true);
    setFlyingTarget({ from: startRect, to: endRect });
    setFlyingButterflyKey(k => k + 1);
    playTokenSound();

    const ANIMATION_DURATION = 1200;
    setTimeout(async () => {
      setEarnedTokens(prev => prev + 1);
      setFlyingTarget(null);

      setIsLoading(true);
      try {
        const newMessage = await getMotivationalMessage(mood);
        setMessage(newMessage);
        playMessageSound();
      } catch (error) {
        console.error("Gemini API error:", error);
        const randomIndex = Math.floor(Math.random() * FALLBACK_MESSAGES.length);
        setMessage(FALLBACK_MESSAGES[randomIndex]);
        playMessageSound();
      } finally {
        setIsLoading(false);
        setIsAnimatingToken(false);
      }
    }, ANIMATION_DURATION);
  }, [earnedTokens, maxTokens, isLoading, isAnimatingToken, mood]);

  const handleStartCatch = () => {
    if (!isAudioInitialized) {
      initAudio();
      setIsAudioInitialized(true);
    }
    setIsARViewOpen(true);
  };

  const handleButterflyCaught = () => {
    setIsARViewOpen(false);
    setShowCatchConfetti(true);
    // Create a fake DOMRect for the center of the screen as the animation start point
    const startRect = new DOMRect(window.innerWidth / 2 - 25, window.innerHeight / 2 - 25, 50, 50);
    addTokenAndGetMessage(startRect);
  };
  
  useEffect(() => {
    if (earnedTokens === maxTokens) {
      setIsCelebrating(true);
      setMessage("You did it! You've reached the castle! You are the Queen of Reading!");
      playMilestoneSound();
      const celebrationTimer = setTimeout(() => setIsCelebrating(false), 8000);
      // Open journal after celebration
      const journalTimer = setTimeout(() => {
        setJournalMode('write');
        setIsJournalOpen(true);
      }, 8500);
      return () => {
        clearTimeout(celebrationTimer);
        clearTimeout(journalTimer);
      }
    }
  }, [earnedTokens, maxTokens]);

  const handleReset = () => {
    if (!isAudioInitialized) {
      initAudio();
      setIsAudioInitialized(true);
    }
    playResetSound();
    setEarnedTokens(0);
    setIsCelebrating(false);
    setMessage("Ready for a new adventure, Princess Celine?");
    setMood(null);
  };

  const handleShowJournal = () => {
    setJournalMode('read');
    setIsJournalOpen(true);
  }

  if (!mood) {
    return <MoodSelector onSelectMood={setMood} />;
  }

  return (
    <div className={`min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-pink-300 transition-colors duration-1000 ${getMoodClass(mood)}`}>
      {isCelebrating && <Celebration />}
      {showCatchConfetti && <CatchConfetti onComplete={() => setShowCatchConfetti(false)} />}
      {isARViewOpen && <ARView onCatch={handleButterflyCaught} onClose={() => setIsARViewOpen(false)} />}
      {isJournalOpen && <JournalModal mode={journalMode} onClose={() => setIsJournalOpen(false)} />}
      
      {flyingTarget && (
        <FlyingButterfly 
          key={flyingButterflyKey} 
          from={flyingTarget.from} 
          to={flyingTarget.to} 
        />
      )}
      <div className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Celine's Royal Reading Quest
          </h1>
          <p className="text-lg text-purple-700 mt-1">Earn butterflies and travel to the magical castle!</p>
        </header>
        
        <main>
          <TokenBoard stages={stages} earnedTokens={earnedTokens} slotRefs={tokenSlotRefs} />
          <MessageDisplay isLoading={isLoading} message={message} />
        </main>

        <footer className="pt-4 border-t-2 border-dashed border-pink-300">
          <Controls 
            onStartCatch={handleStartCatch} 
            onReset={handleReset}
            onShowJournal={handleShowJournal}
            isBoardFull={earnedTokens >= maxTokens}
            isLoading={isLoading || isAnimatingToken}
          />
        </footer>
      </div>
       <div className="text-center mt-4 text-sm text-pink-700/80">
        <p>Created with love for a super reader!</p>
      </div>
    </div>
  );
};

export default App;