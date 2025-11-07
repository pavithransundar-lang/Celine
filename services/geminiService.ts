import { GoogleGenAI } from "@google/genai";
import { Mood } from '../types';

// FIX: Refactored to align with @google/genai coding guidelines.
// The GoogleGenAI client is initialized once and directly uses `process.env.API_KEY`.
// This removes unnecessary helper functions and assumes the API key is pre-configured
// and available in the environment, as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Define mood-based instructions
const moodInstructions: Record<Mood, string> = {
  happy: 'energetic and celebratory, using exclamation points and happy words',
  neutral: 'calm, gentle, and steadily encouraging',
  sad: 'soft, comforting, and understanding, like a warm hug in words',
};

export const getMotivationalMessage = async (mood: Mood): Promise<string> => {
  try {
    const tone = moodInstructions[mood] || moodInstructions.neutral;
    const prompt = `Generate a very short, positive, and encouraging message for a 7-year-old girl named Celine who is learning to read. She loves princesses and butterflies.
Her current mood is feeling a bit ${mood === 'sad' ? 'sad or tired' : mood}.
The message must be one cheerful sentence, with a ${tone} tone.
Examples: "You're a reading superstar!", "Every page is a new adventure!". Do not use markdown.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text.trim();
    // Basic cleanup to remove potential quotes
    return text.replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error generating motivational message:", error);
    throw new Error("Failed to get a message from Gemini.");
  }
};

export const getJournalReflection = async (
  answer1: string,
  answer2: string
): Promise<string> => {
  try {
    const prompt = `A 7-year-old girl named Celine is reflecting on her reading.
Her favorite part was: "${answer1}"
The tricky part was: "${answer2}"
Write a very short, positive, and encouraging one-sentence reflection for her, as if you are a magical journal. Address her by name. Example: "Celine, it's wonderful that you enjoyed the adventure, and it's so smart to notice the tricky words!". Do not use markdown or quotes.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating journal reflection:", error);
    throw new Error("Failed to get a reflection from Gemini.");
  }
};