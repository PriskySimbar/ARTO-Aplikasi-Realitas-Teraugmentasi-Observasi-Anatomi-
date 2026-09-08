import React, { useState, useEffect } from 'react';
import { AnatomyPart, ANATOMY_DATA } from '../data/anatomyData';
import { BrainCircuit, Check, X, HelpCircle, Trophy, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Question {
  part: AnatomyPart;
  options: string[];
  hint: string;
}

interface AnatomyQuizProps {
  system: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function AnatomyQuiz({ system, onClose, onComplete }: AnatomyQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  // Generate questions with multiple choice options
  useEffect(() => {
    const allParts = Object.values(ANATOMY_DATA);
    const systemParts = allParts.filter(p => p.system === system || (!p.system && system === 'skeletal'));
    const shuffled = [...systemParts].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    
    const quizQuestions: Question[] = selected.map(part => {
      // Generate 3 wrong options from the same system if possible
      const otherParts = systemParts.filter(p => p.id !== part.id);
      const randomWrong = otherParts.sort(() => Math.random() - 0.5).slice(0, 3).map(p => p.name);
      const options = [part.name, ...randomWrong].sort(() => Math.random() - 0.5);

      return {
        part,
        options,
        hint: part.medicalExplanation.split('.')[0] + '.'
      };
    });
    
    setQuestions(quizQuestions);
  }, [system, sessionKey]);

  const handleOptionSelect = (name: string) => {
    if (showResult !== null) return;
    setSelectedOption(name);
    
    const correctName = questions[currentIdx].part.name;
    if (name === correctName) {
      setScore(s => s + 1);
      setShowResult('correct');
    } else {
      setShowResult('incorrect');
    }

    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    setShowResult(null);
    setShowHint(false);
    setSelectedOption(null);
    
    if (currentIdx === questions.length - 1) {
      setFinished(true);
      onComplete(score + (showResult === 'correct' ? 1 : 0));
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  if (questions.length === 0) return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">
      <RefreshCw className="animate-spin text-primary w-10 h-10" />
    </div>
  );

  const currentQuestion = questions[currentIdx];

  if (finished) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl pointer-events-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/10 text-center space-y-8 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_#4da1ff]">
            <Trophy className="text-primary w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif italic text-white leading-tight">Uji Kompetensi Selesai</h2>
            <p className="text-primary font-mono text-[10px] font-bold uppercase tracking-[0.2em] italic">Neural Sync Index</p>
          </div>
          
          <div className="py-6 sm:py-8 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
            <span className="text-6xl sm:text-7xl font-black text-white">{Math.round((score / questions.length) * 100)}%</span>
            <p className="text-[10px] sm:text-[11px] text-white/40 mt-3 font-medium tracking-widest uppercase">{score} dari {questions.length} identifikator tepat</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              className="bg-white/5 border border-white/10 text-white rounded-2xl py-4 font-bold hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest"
            >
              Keluar
            </button>
            <button 
              onClick={() => {
                setFinished(false);
                setCurrentIdx(0);
                setScore(0);
                setSessionKey(prev => prev + 1);
              }}
              className="bg-primary text-black rounded-2xl py-4 font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(77,161,255,0.3)] uppercase text-[10px] tracking-widest"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col h-full overflow-hidden p-2 sm:p-8">
      {/* HUD - Top Bar Adjustment for mobile to avoid logo overlap */}
      <div className="flex justify-between items-start pointer-events-auto p-4 sm:p-0">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 max-w-[240px] sm:max-w-none mt-16 sm:mt-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-[9px] sm:text-xs font-black text-white uppercase tracking-[0.2em] truncate">Identifikasi Struktural</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden w-16 sm:w-24">
                <motion.div 
                  className="h-full bg-primary shadow-[0_0_10px_#4da1ff]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[9px] text-primary/80 font-bold uppercase tracking-widest shrink-0">{currentIdx + 1}/{questions.length}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-2xl active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      {/* HUD - HUD Components (Case & MCQ) */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-4 sm:gap-6 pointer-events-none overflow-y-auto no-scrollbar sm:overflow-visible pb-4 sm:pb-0">
        
        {/* Left Side: Case Study */}
        <div className="w-full lg:max-w-xl pointer-events-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 border border-white/10 bg-black/80 shadow-3xl space-y-3 sm:space-y-6"
          >
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 sm:h-4 bg-primary rounded-full shadow-[0_0_10px_#4da1ff]" />
                <span className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.3em]">Instruksi Diagnostik</span>
              </div>
              <h4 className="text-sm sm:text-lg md:text-2xl font-serif italic text-white leading-tight">
                "Di manakah posisi struktural dari deskripsi berikut?"
              </h4>
              <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5 shadow-inner max-h-[100px] sm:max-h-none overflow-y-auto">
                <p className="text-xs sm:text-base text-white/70 leading-relaxed font-light italic">
                  {currentQuestion.part.medicalExplanation}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 flex items-start gap-3"
                >
                  <HelpCircle className="w-3 h-3 text-secondary shrink-0 mt-1" />
                  <div>
                    <span className="text-[7px] font-black text-secondary uppercase tracking-widest block mb-1">Data Clue</span>
                    <p className="text-[10px] text-secondary/80 font-medium">{currentQuestion.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Multiple Choice Selection */}
        <div className="w-full lg:w-[380px] pointer-events-auto">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 border border-white/10 bg-black/80 shadow-3xl space-y-4 sm:space-y-6"
          >
            <div className="space-y-2 sm:space-y-4">
              <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Opsi Identifikasi Kode</span>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = showResult && option === currentQuestion.part.name;
                  const isWrong = showResult === 'incorrect' && isSelected;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={showResult !== null}
                      className={cn(
                        "min-h-[48px] sm:h-20 rounded-xl sm:rounded-2xl border flex items-center justify-center text-center px-2 sm:px-4 py-2 text-[10px] sm:text-base font-bold sm:font-black transition-all active:scale-95 leading-tight",
                        !showResult && "bg-white/5 border-white/10 text-white hover:border-primary/50 hover:bg-primary/5",
                        isCorrect && "bg-primary border-primary text-black shadow-[0_0_20px_rgba(77,161,255,0.4)] scale-105 z-10",
                        isWrong && "bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                        showResult && !isCorrect && !isWrong && "opacity-20 border-white/5 text-white"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {!showHint && showResult === null && (
              <button 
                onClick={() => setShowHint(true)}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 sm:py-3 text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] hover:border-secondary/30 hover:text-secondary transition-all"
              >
                Gunakan Bantuan Diagnostik
              </button>
            )}

            <div className="h-10 sm:h-16 flex flex-col items-center justify-center relative">
              <AnimatePresence mode="wait">
                {showResult === 'correct' && (
                  <motion.div 
                    key="correct"
                    initial={{ scale: 0.5, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 text-primary"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Sinkron Sempurna</span>
                  </motion.div>
                )}
                {showResult === 'incorrect' && (
                  <motion.div 
                    key="incorrect"
                    initial={{ scale: 0.5, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 text-red-500"
                  >
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Indeks Tidak Sesuai</span>
                  </motion.div>
                )}
                {!showResult && (
                  <div className="flex flex-col items-center gap-2 text-white/5 animate-pulse">
                    <Layers className="w-8 h-8 opacity-20" />
                    <span className="text-[9px] font-black uppercase tracking-widest tracking-[0.3em]">Pilih Pulse</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
