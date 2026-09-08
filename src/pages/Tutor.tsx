import React from 'react';
import { Cpu } from 'lucide-react';
import { AITutor } from '../components/AITutor';
import { INITIAL_MODULES } from '../constants';

export function Tutor() {
  return (
    <div className="h-[calc(100dvh-130px)] lg:h-[calc(100vh-80px)] flex flex-col gap-6">
      <header className="flex flex-col gap-2 shrink-0 animate-in fade-in duration-700">
        <div className="flex items-center gap-3 text-primary">
          <Cpu className="w-6 h-6 shadow-[0_0_15px_#4da1ff]" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em]">Asisten Cerdas</h1>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">Tomy <span className="text-primary">AI</span></h2>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1">
             <AITutor moduleName="General Anatomy" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 overflow-y-auto">
           <section className="glass-panel rounded-2xl p-6 bg-slate-900/40">
             <h3 className="font-bold text-xs uppercase tracking-widest text-outline mb-4">Study Modules</h3>
             <div className="space-y-3">
               {INITIAL_MODULES.map(m => (
                 <div key={m.id} className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                       {m.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{m.name}</p>
                      <p className="text-[10px] text-outline truncate">{m.difficulty}</p>
                    </div>
                 </div>
               ))}
             </div>
           </section>

           <section className="glass-panel rounded-2xl p-6 bg-slate-900/40">
             <h3 className="font-bold text-xs uppercase tracking-widest text-outline mb-4">Quick Actions</h3>
             <div className="grid grid-cols-1 gap-2">
                <button className="text-left p-3 rounded-lg bg-surface-container border border-white/5 hover:bg-slate-800 transition-colors text-xs font-medium">
                  Review Neuro Suture Points
                </button>
                <button className="text-left p-3 rounded-lg bg-surface-container border border-white/5 hover:bg-slate-800 transition-colors text-xs font-medium">
                  Explain Myocardial Thickening
                </button>
                <button className="text-left p-3 rounded-lg bg-surface-container border border-white/5 hover:bg-slate-800 transition-colors text-xs font-medium">
                  Explain Blood Flow Dynamics
                </button>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
