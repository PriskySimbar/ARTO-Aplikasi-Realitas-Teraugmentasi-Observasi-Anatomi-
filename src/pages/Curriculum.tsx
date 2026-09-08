import React, { useState, useEffect } from 'react';
import { INITIAL_MODULES } from '../constants';
import { generateQuiz as generateAIQuiz } from '../services/geminiService';
import { Quiz } from '../components/Quiz';
import { PlayCircle, CheckCircle2, Lock, ArrowRight, BrainCircuit, RefreshCw, ChevronDown, ListChecks, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, getDocs, addDoc, where, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { Quiz as QuizType } from '../types';

export function Curriculum() {
  const { user } = useAuth();
  const { moduleProgress } = useModuleProgress();
  const [activeQuiz, setActiveQuiz] = useState<any[] | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState('');
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  
  const [lecturerQuizzes, setLecturerQuizzes] = useState<QuizType[]>([]);
  const [showQuizzesFor, setShowQuizzesFor] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const path = 'quizzes';
    try {
      const q = query(collection(db, path));
      const snap = await getDocs(q);
      setLecturerQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizType)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  };

  const startAIQuiz = async (moduleName: string, moduleId: string) => {
    setLoadingQuiz(true);
    setSelectedModuleName(moduleName);
    setCurrentModuleId(moduleId);
    setCurrentQuizId('ai-generated');
    const quizData = await generateAIQuiz(moduleName, 'Clinical');
    setActiveQuiz(quizData);
    setLoadingQuiz(false);
  };

  const startLecturerQuiz = (quiz: QuizType) => {
    const module = INITIAL_MODULES.find(m => m.id === quiz.moduleId);
    setSelectedModuleName(module?.name || '');
    setCurrentModuleId(quiz.moduleId);
    setCurrentQuizId(quiz.id);
    setActiveQuiz(quiz.questions);
  };

  const handleQuizComplete = async (score: number) => {
    if (!user || !activeQuiz) return;

    const path = 'user_quiz_results';
    try {
      // 1. Save results
      await addDoc(collection(db, path), {
        userId: user.uid,
        quizId: currentQuizId,
        moduleId: currentModuleId,
        score: score,
        total: activeQuiz.length,
        percentage: Math.round((score / activeQuiz.length) * 100),
        completedAt: new Date().toISOString(),
      });

      // 2. Refresh overall average score (Simple implementation)
      const q = query(collection(db, 'user_quiz_results'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => d.data());
      const totalPercentage = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      const avgPercentage = results.length > 0 ? Math.round(totalPercentage / results.length) : 0;

      // Update user doc
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { overallScore: avgPercentage }, { merge: true });

    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  };

  if (activeQuiz) {
    return (
      <div className="pb-20">
        <button 
          onClick={() => setActiveQuiz(null)}
          className="mb-8 text-primary font-mono text-xs font-bold flex items-center gap-2 hover:underline"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          KEMBALI KE ARTOCurriculum
        </button>
        <Quiz 
          questions={activeQuiz} 
          title={`Asesmen ${selectedModuleName}`} 
          onComplete={handleQuizComplete} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col gap-2 shrink-0 animate-in fade-in duration-700">
        <div className="flex items-center gap-3 text-primary">
          <GraduationCap className="w-6 h-6 shadow-[0_0_15px_#4da1ff]" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em]">Kurikulum Kompetensi</h1>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">ARTO<span className="text-primary">Curriculum</span></h2>
      </header>

      {loadingQuiz && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <BrainCircuit className="w-12 h-12 text-primary animate-pulse shadow-[0_0_20px_rgba(77,161,255,0.4)]" />
          <p className="text-primary font-sans font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Gemini sedang menyiapkan ujian Anda...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {INITIAL_MODULES.map((module, i) => {
          const moduleQuizzes = lecturerQuizzes.filter(q => q.moduleId === module.id);
          const progress = moduleProgress[module.id] || 0;
          
          return (
            <div key={module.id} className="relative">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center group hover:border-primary/30 transition-all z-10 relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 relative">
                    <div className="absolute -top-3 -left-3 bg-primary/20 text-primary w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs ring-4 ring-[#0a0a0a] border border-primary/40">0{i+1}</div>
                    {progress === 100 ? <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary shadow-[0_0_10px_rgba(77,161,255,0.3)]" /> : 
                     progress > 0 ? <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" /> :
                     <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white/20" />}
                </div>
                
                <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{module.name}</h3>
                      <span className={cn(
                        "text-[7px] sm:text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase shrink-0",
                        module.difficulty === 'Surgical' ? "border-red-500/50 text-red-400 bg-red-400/5" : 
                        module.difficulty === 'Clinical' ? "border-primary/50 text-primary bg-primary/5" : "border-white/20 text-white/40 bg-white/5"
                      )}>
                        {module.difficulty === 'Surgical' ? 'Bedah' : module.difficulty === 'Clinical' ? 'Klinis' : 'Dasar'}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/40 line-clamp-1 leading-relaxed italic">{module.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="max-w-md mt-4 space-y-2">
                      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                        <span className="text-white/20">Penguasaan Modul</span>
                        <span className="text-primary font-mono">{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                    <button 
                      onClick={() => setShowQuizzesFor(showQuizzesFor === module.id ? null : module.id)}
                      className="bg-transparent border border-primary/30 text-primary px-4 py-2.5 rounded-lg font-sans text-[9px] sm:text-[10px] font-bold tracking-widest hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <ListChecks className="w-3.5 h-3.5" />
                      KUIS DOSEN {moduleQuizzes.length > 0 && `(${moduleQuizzes.length})`}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", showQuizzesFor === module.id && "rotate-180")} />
                    </button>
                    <button 
                      onClick={() => startAIQuiz(module.name, module.id)}
                      className="bg-transparent border border-white/10 text-white/60 px-4 py-2.5 rounded-lg font-sans text-[9px] sm:text-[10px] font-bold tracking-widest hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw className="w-3.5 h-3.5 opacity-50" />
                      KUIS AI
                    </button>
                    <Link 
                      to={`/library/${module.id}`}
                      className="bg-white text-black px-6 py-2.5 rounded-lg font-sans text-[9px] sm:text-[10px] font-bold tracking-widest shadow-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      MULAI
                    </Link>
                  </div>
              </div>

              {/* Sub Quizzes Dropdown */}
              {showQuizzesFor === module.id && (
                <div className="mt-2 ml-10 p-4 bg-white/5 border-l-2 border-primary/30 rounded-r-xl space-y-2 animate-in slide-in-from-top-2">
                  {moduleQuizzes.length === 0 ? (
                    <p className="text-[10px] text-white/20 italic p-2">Belum ada kuis khusus dari dosen untuk modul ini.</p>
                  ) : (
                    moduleQuizzes.map(quiz => (
                      <button 
                        key={quiz.id}
                        onClick={() => startLecturerQuiz(quiz)}
                        className="w-full text-left p-3 rounded-lg hover:bg-white/5 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-white/80 group-hover:text-primary transition-colors">{quiz.title}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

