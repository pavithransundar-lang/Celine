import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { getJournalReflection } from '../services/geminiService';

interface JournalModalProps {
  mode: 'read' | 'write';
  onClose: () => void;
}

const JOURNAL_KEY = 'celine-royal-reading-journal';
const Q1 = "What was your favorite part of today’s reading adventure?";
const Q2 = "What did you find tricky?";

export const JournalModal: React.FC<JournalModalProps> = ({ mode, onClose }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [step, setStep] = useState<'q1' | 'q2' | 'reflecting' | 'done'>('q1');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(JOURNAL_KEY);
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    }
  }, []);
  
  const saveEntry = (newEntry: JournalEntry) => {
    try {
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
        console.error("Failed to save journal entry:", error);
    }
  }

  const handleSubmit = async () => {
    if (!answer1 || !answer2) return;
    setIsLoading(true);
    setStep('reflecting');

    try {
        const aiReflection = await getJournalReflection(answer1, answer2);
        setReflection(aiReflection);
        const newEntry: JournalEntry = {
            date: new Date().toLocaleDateString(),
            q1: Q1, a1: answer1,
            q2: Q2, a2: answer2,
            reflection: aiReflection,
        };
        saveEntry(newEntry);
    } catch (error) {
        setReflection("You did an amazing job reflecting on your reading today!");
    } finally {
        setIsLoading(false);
        setStep('done');
    }
  };

  const renderWriteView = () => {
    switch(step) {
      case 'q1': return (
        <div className="text-center space-y-4">
          <label htmlFor="q1" className="block text-xl font-semibold text-purple-800">{Q1}</label>
          <textarea id="q1" value={answer1} onChange={e => setAnswer1(e.target.value)} rows={4} className="w-full p-2 border-2 border-yellow-500 rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" />
          <button onClick={() => setStep('q2')} disabled={!answer1} className="px-6 py-2 text-lg font-bold text-white bg-pink-500 rounded-full hover:bg-pink-600 disabled:bg-gray-400">Next</button>
        </div>
      );
      case 'q2': return (
        <div className="text-center space-y-4">
          <label htmlFor="q2" className="block text-xl font-semibold text-purple-800">{Q2}</label>
          <textarea id="q2" value={answer2} onChange={e => setAnswer2(e.target.value)} rows={4} className="w-full p-2 border-2 border-yellow-500 rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" />
          <button onClick={handleSubmit} disabled={!answer2} className="px-6 py-2 text-lg font-bold text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-400">Save</button>
        </div>
      );
      case 'reflecting': return <p className="text-center text-xl italic">The magical journal is writing a special note for you...</p>;
      case 'done': return (
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-purple-800">✨ A Note From Your Journal ✨</p>
            <p className="text-xl italic p-4 bg-yellow-100 border-l-4 border-yellow-400">"{reflection}"</p>
            <button onClick={onClose} className="px-6 py-2 text-lg font-bold text-white bg-pink-500 rounded-full hover:bg-pink-600">Finish</button>
          </div>
      );
    }
  }
  
  const renderReadView = () => (
    <div className="space-y-6">
      {entries.length === 0 ? (
          <p className="text-center text-lg italic">Your royal journal is empty. Complete a quest to add an entry!</p>
      ) : entries.map((entry, index) => (
        <div key={index} className="journal-entry pb-4 mb-4 border-b-2 border-dashed border-yellow-600/30">
            <p className="font-bold text-lg text-yellow-700">{entry.date}</p>
            <div className="mt-2 pl-4">
                <p className="font-semibold">{entry.q1}</p>
                <p className="italic pl-4">- {entry.a1}</p>
                <p className="font-semibold mt-2">{entry.q2}</p>
                <p className="italic pl-4">- {entry.a2}</p>
                <p className="mt-3 p-2 bg-yellow-100/50 rounded-md border-l-4 border-yellow-400 text-sm">✨ <span className="font-semibold">Journal's Note:</span> "{entry.reflection}"</p>
            </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="journal-modal-backdrop" onClick={onClose}>
      <div className="journal-modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-yellow-700 hover:text-red-500">&times;</button>
        <h2 className="text-3xl font-black text-center mb-6 text-purple-800 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-700">
          Celine's Royal Reading Journal
        </h2>
        {mode === 'write' ? renderWriteView() : renderReadView()}
      </div>
    </div>
  );
};
