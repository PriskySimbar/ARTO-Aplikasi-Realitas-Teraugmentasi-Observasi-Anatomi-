import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { INITIAL_MODULES } from '../constants';
import { AnatomyViewer } from '../components/AnatomyViewer';
import { AITutor } from '../components/AITutor';
import { ChevronRight, Info, Layers, ZoomIn, ZoomOut, Box, Activity, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnatomyPart } from '../data/anatomyData';
import { AnatomyQuiz } from '../components/AnatomyQuiz';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export function Library() {
  const { user } = useAuth();
  const { moduleId } = useParams();
  const location = useLocation();
  const selectedModule = INITIAL_MODULES.find(m => m.id === moduleId) || INITIAL_MODULES[0];
  const [selectedAnatomy, setSelectedAnatomy] = useState<AnatomyPart | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Reset selection when module changes or handles initial quiz mode
  React.useEffect(() => {
    setSelectedAnatomy(null);
    const searchParams = new URLSearchParams(location.search);
    setIsQuizMode(searchParams.get('quiz') === 'true');
  }, [moduleId, location.search]);

  const handleQuizComplete = async (score: number) => {
    console.log('Quiz complete:', score);
    if (!user) return;
    try {
      await addDoc(collection(db, 'user_quiz_results'), {
        userId: user.uid,
        moduleId: selectedModule.id,
        quizId: 'structural_mapping',
        score: score,
        total: 10,
        percentage: Math.round((score / 10) * 100),
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Failed to save structural mapping result:', e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-130px)] lg:h-[calc(100vh-80px)] gap-6 p-4 lg:p-0">
      <header className="flex flex-col gap-2 shrink-0 animate-in fade-in duration-700">
        <div className="flex items-center gap-3 text-primary">
          <Layers className="w-6 h-6 shadow-[0_0_15px_#4da1ff]" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em]">Studi Anatomi</h1>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">Atlas<span className="text-primary">3D</span></h2>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 lg:min-h-0 gap-6 lg:overflow-hidden relative">
        
        {/* Main Area: 3D Viewport or Quiz Overlay */}
        <div className="w-full shrink-0 flex-none lg:flex-1 flex flex-col gap-6 lg:h-full overflow-hidden order-1 lg:order-2">
        <div className={cn(
          "relative rounded-3xl overflow-hidden shadow-3xl border border-white/5 bg-[#050505] shrink-0",
          isQuizMode ? "fixed inset-0 z-40 rounded-none border-none sm:relative sm:z-0 sm:rounded-3xl sm:border sm:flex-1" : "h-[500px] sm:h-[600px] lg:h-full lg:flex-1"
        )}>
          <AnatomyViewer 

            key={selectedModule.id}
            modelUrl={selectedModule.modelUrl}
            title={selectedModule.name}
            system={selectedModule.id as any}
            onSelect={setSelectedAnatomy}
            selectedId={selectedAnatomy?.id || null}
          />
          
          {/* Quiz Launcher Toggle - Moved to top right for mobile visibility */}
          {!isQuizMode && (
            <div className="absolute top-20 sm:top-24 right-4 sm:right-6 z-30">
              <button 
                onClick={() => setIsQuizMode(true)}
                className="bg-primary hover:brightness-110 text-black px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(77,161,255,0.4)] transition-all flex items-center gap-3 border border-white/20 active:scale-95 whitespace-nowrap"
              >
                <BrainCircuit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Mulai Kuis Struktural</span>
                <span className="xs:hidden">KUIS</span>
              </button>
            </div>
          )}
        </div>

        {/* Quiz UI Overlay - Transparent HUD style */}
        {isQuizMode && (
          <div className="fixed inset-0 z-50 pointer-events-none">
             <AnatomyQuiz 
               system={selectedModule.id} 
               onClose={() => setIsQuizMode(false)}
               onComplete={handleQuizComplete}
             />
          </div>
        )}
      </div>

      {/* Clinical Info - Right Panel (Hidden in Quiz Mode) */}
      {!isQuizMode && (
        <div className={cn(
          "w-full lg:w-[260px] xl:w-[300px] flex flex-col gap-6 order-2 lg:order-3",
          "lg:h-full lg:overflow-hidden lg:flex"
        )}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-8 flex flex-col min-h-[300px] lg:h-full shadow-2xl relative overflow-y-auto no-scrollbar scroll-smooth">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_#4da1ff]" />
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Metodologi Kasus</h3>
              </div>
              <p className="text-[12px] text-white/60 leading-relaxed italic font-serif">
                {selectedModule.description}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

            {/* Interactive Detail Content */}
            <div className="flex-1 relative z-10">
              {selectedAnatomy ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <header className="space-y-2">
                    <div className="flex items-center gap-3 text-secondary">
                      <Activity className="w-5 h-5 shadow-[0_0_10px_#71f8e4]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">ID Neural Terkonfirmasi</span>
                    </div>
                    <h2 className="text-2xl font-serif italic text-white tracking-tight leading-tight">
                      {selectedAnatomy.name}
                    </h2>
                  </header>

                  <div className="space-y-4">
                    <div className="bg-white/5 border-l-2 border-primary/40 p-4 rounded-r-xl">
                      <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] block mb-2">Konteks Klinis & Fungsi Medis</span>
                      <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                        {selectedAnatomy.medicalExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center space-y-6 animate-pulse">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10 border border-white/5">
                    <Info className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Menunggu Seleksi</h4>
                    <p className="text-[12px] text-white/20 max-w-[220px] leading-relaxed italic font-serif">Pilih titik struktural di area 3D untuk sinkronisasi indeks medis.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-50" />
          </div>
        </div>
      )}

      {/* AI Tutor - Left Column (Hidden in Quiz Mode) */}
      {!isQuizMode && (
        <div className={cn(
          "w-full lg:w-[260px] xl:w-[300px] shrink-0 flex flex-col gap-4 order-3 lg:order-1",
          "h-[450px] lg:h-full flex"
        )}>
          <div className="flex-1 flex flex-col">
             <AITutor moduleId={selectedModule.id} moduleName={selectedModule.name} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
