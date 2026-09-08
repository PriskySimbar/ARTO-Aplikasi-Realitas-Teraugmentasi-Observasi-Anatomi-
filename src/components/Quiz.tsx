import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  title: string;
}

export function Quiz({ questions, onComplete, title }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const handleNext = () => {
    if (selectedIdx === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }

    if (currentIdx === questions.length - 1) {
      setFinished(true);
      onComplete(score + (selectedIdx === currentQuestion.answer ? 1 : 0));
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    }
  };

  if (finished) {
    return (
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center shadow-[0_0_30px_#4fdbc8]">
          <Trophy className="text-secondary w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Quiz Complete!</h2>
          <p className="text-on-surface-variant font-mono">You scored {score}/{questions.length}</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => {
              setFinished(false);
              setCurrentIdx(0);
              setSelectedIdx(null);
              setIsAnswered(false);
              setScore(0);
            }}
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
           >
             Try Again
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="space-y-4">
        <h2 className="text-2xl font-black text-on-surface">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-outline uppercase tracking-widest whitespace-nowrap">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <p className="text-xl font-medium leading-relaxed text-white">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={cn(
                  "flex items-center p-4 rounded-xl border transition-all text-left group",
                  selectedIdx === i 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-surface-container-low border-outline-variant hover:border-primary/50 text-on-surface-variant"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0",
                  selectedIdx === i ? "border-primary bg-primary" : "border-tertiary"
                )}>
                  {selectedIdx === i && <div className="w-1.5 h-1.5 bg-surface rounded-full" />}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              disabled={selectedIdx === null}
              onClick={handleNext}
              className="bg-primary text-on-primary px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              {currentIdx === questions.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
