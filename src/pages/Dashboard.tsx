import React, { useState } from 'react';
import { INITIAL_MODULES } from '../constants';
import { Activity, Zap, Cpu, PlayCircle, CheckCircle2, Lock, ArrowRight, BrainCircuit, GraduationCap, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { useModuleProgress } from '../hooks/useModuleProgress';

export function Dashboard() {
  const { userData } = useAuth();
  const { moduleProgress } = useModuleProgress();

  const modulesCount = INITIAL_MODULES.length;
  const completedCount = Object.values(moduleProgress).filter(p => p === 100).length;
  const overallProgress = modulesCount > 0 
    ? Math.round(Object.values(moduleProgress).reduce((acc, curr) => acc + curr, 0) / modulesCount)
    : 0;

  const stats = [
    { label: 'Progres Keseluruhan', value: `${overallProgress}%`, icon: Activity, color: 'text-primary' },
    { label: 'Total Modul', value: `${completedCount}/${modulesCount}`, icon: GraduationCap, color: 'text-secondary' },
    { label: 'Level Bedah', value: 'Lvl 2', icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Lecturer Quick Access */}
      {userData?.role === 'lecturer' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(77,161,255,0.1)] mb-8"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center shrink-0">
               <GraduationCap className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-white font-bold text-xl">Selamat Datang, Dosen</h2>
               <p className="text-white/60 text-sm italic">Monitor progress mahasiswa dan kelola kuis dari Portal Dosen.</p>
             </div>
          </div>
          <Link to="/lecturer" className="bg-primary text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 whitespace-nowrap flex items-center gap-2">
            Buka Portal Dosen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Hero Welcome */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 py-2 sm:py-4">
        <div className="space-y-2 sm:space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_primary]" />
            Lingkungan Pembelajaran Klinis
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif italic text-white tracking-tighter leading-none"
          >
            Dasbor Utama
          </motion.h1>
          <p className="text-white/30 text-sm md:text-base max-w-md leading-relaxed italic">
            Sinkronisasi data anatomi dengan protokol diagnostik klinis. Progres Anda sedang dipantau.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/5 p-3 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4 flex-1 min-w-[140px] shadow-2xl"
            >
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">{stat.label}</span>
                <span className="text-lg font-bold text-white tracking-tight leading-none">{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Curriculum Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <h2 className="text-white font-serif italic text-2xl tracking-tight">Kurikulum Aktif</h2>
              <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Pemetaan Progres Modul</span>
            </div>
            <Link to="/curriculum" className="text-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
              Lihat Semua <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-4">
            {INITIAL_MODULES.map((module, i) => {
              const progress = moduleProgress[module.id] || 0;
              const isLocked = false;

              return (
                <div 
                  key={module.id} 
                  className={cn(
                    "group relative overflow-hidden bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:border-primary/20",
                    isLocked && "opacity-50"
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                    <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                      <div className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                        progress === 100 ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(77,161,255,0.2)]" : 
                        progress > 0 ? "bg-white/10 border-white/20 text-white/80" : "bg-white/5 border-white/5 text-white/20"
                      )}>
                        {progress === 100 ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : 
                         isLocked ? <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                         <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />}
                      </div>
                      
                      <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">{module.name}</h3>
                          <span className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest border border-white/5 px-1.5 py-0.5 rounded shrink-0">{module.difficulty}</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-white/40 italic line-clamp-1">{module.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                      <div className="w-full sm:w-[160px] md:w-[200px] lg:w-[220px] space-y-1.5 sm:space-y-2 shrink-0">
                         <div className="flex justify-between items-end gap-2">
                           <span className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest truncate">
                             {progress > 0 ? 'Sinkronisasi' : 'Koneksi Tertunda'}
                           </span>
                           <span className="text-[10px] sm:text-xs font-bold text-white/80 font-mono tracking-tighter shrink-0">{progress}%</span>
                         </div>
                         <div className="h-1 sm:h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full transition-colors duration-500",
                                progress === 100 ? "bg-primary" : progress > 0 ? "bg-white/40" : "bg-transparent"
                              )}
                            />
                         </div>
                      </div>

                      <div className="shrink-0 flex items-center w-full sm:w-auto">
                        <Link 
                          to={isLocked ? '#' : `/library/${module.id}`}
                          className={cn(
                            "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all text-center min-w-[120px] w-full",
                            isLocked ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-white text-black hover:bg-primary hover:text-white"
                          )}
                        >
                          {progress === 100 ? 'Tinjau Modul' : progress > 0 ? 'Lanjutkan' : isLocked ? 'Terkunci' : 'Inisialisasi'}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.02] to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialized Access Sidebar */}
        <div className="space-y-8">
          
          <section className="space-y-4">
             <div className="flex flex-col px-1">
                <h3 className="text-white font-serif italic text-xl tracking-tight">Laboratorium Spesialis</h3>
                <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Protokol Diagnostik</span>
             </div>
             
             <div className="grid gap-4">
                {/* Radiology Lab Card */}
                <Link 
                  to="/radiology-lab"
                  className="group relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-2xl p-6 hover:border-secondary/30 transition-all shadow-xl"
                >
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(255,51,102,0.1)] transition-transform group-hover:scale-110">
                      <Microscope className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold tracking-tight">ARTOLab</h4>
                      <p className="text-[11px] text-white/40 leading-relaxed italic">Bidang korelasi pemindaian MRI & CT. Verifikasi patologi skeletal.</p>
                    </div>
                    <div className="pt-2">
                       <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Akses Terminal &rarr;</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-[40px] -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors" />
                </Link>
             </div>
          </section>

          {/* AI Tutor Mini Card */}
          <div className="bg-primary/[0.02] border border-primary/10 p-6 rounded-2xl space-y-4 relative overflow-hidden">
             <div className="flex items-center gap-3 text-primary relative z-10">
               <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                 <Cpu className="w-4 h-4" />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Tomy AI Assistant</h4>
             </div>
             <p className="text-[11px] text-white/50 leading-relaxed italic relative z-10 font-medium">
               "Jalur saraf menunjukkan Anda fokus pada struktur kranial. Haruskah saya menyiapkan analisis mendalam?"
             </p>
             <Link to="/tutor" className="block w-full py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-center text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all relative z-10">
               Inisialisasi Protokol
             </Link>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mb-16 -mr-16" />
          </div>

        </div>

      </div>
    </div>
  );
}
