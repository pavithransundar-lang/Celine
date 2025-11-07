// A simple service to play programmatic sounds using the Web Audio API.

let audioContext: AudioContext | null = null;

// Initialize the AudioContext. Must be called after a user interaction (e.g., a click).
export const initAudio = () => {
  if (!audioContext && typeof window !== 'undefined') {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
    }
  }
};

const playSound = (
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number = 0.5,
  rampDown: boolean = true
) => {
  if (!audioContext) return;

  // Browsers may suspend the AudioContext if the user hasn't interacted with the page for a while.
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.connect(audioContext.destination);
  gainNode.gain.setValueAtTime(volume * 0.01, audioContext.currentTime); // Start slightly quieter
  gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.05); // Fade in quickly

  if (rampDown) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  }

  oscillator.connect(gainNode);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

/**
 * Helper to play a delayed sound, used for creating sparkle effects.
 */
const playSparkle = (delay: number, freq: number, duration: number, vol: number) => {
  setTimeout(() => playSound('sine', freq, duration, vol), delay);
};


/**
 * Plays a magical "bling" and sparkle sound for earning a token.
 */
export const playTokenSound = () => {
  // Main chime sound
  playSound('triangle', 880, 0.4, 0.3); // A4

  // Magical sparkles
  playSparkle(50, 1396.91, 0.2, 0.15); // F#6
  playSparkle(120, 1760.00, 0.15, 0.1); // A6
  playSparkle(180, 2093.00, 0.1, 0.08); // C7
};

/**
 * Plays a soft "chime" with a sparkle for when a new message appears.
 */
export const playMessageSound = () => {
  playSound('triangle', 987.77, 0.3, 0.25); // B5
  playSparkle(80, 1567.98, 0.2, 0.1); // G6 sparkle
};


/**
 * Plays a triumphant arpeggio for reaching the castle.
 */
export const playMilestoneSound = () => {
  const t = audioContext?.currentTime ?? 0;
  const playNote = (freq: number, startTime: number) => {
    playSound('sine', freq, 0.2, 0.4, true);
  };
  playNote(523.25, t); // C5
  setTimeout(() => playNote(659.25, t + 0.15), 150); // E5
  setTimeout(() => playNote(783.99, t + 0.3), 300); // G5
  setTimeout(() => playSound('sine', 1046.50, 0.4, 0.5, true), 450); // C6 - final note rings longer
};

/**
 * Plays a simple sound for resetting the board.
 */
export const playResetSound = () => {
  playSound('sawtooth', 220, 0.15, 0.2);
  setTimeout(() => playSound('sawtooth', 185, 0.2, 0.15), 100);
};