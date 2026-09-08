import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Target, Zap, Clock, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { INITIAL_MODULES } from '../constants';

const DATA = [
  { name: 'Mon', score: 65, accuracy: 72 },
  { name: 'Tue', score: 72, accuracy: 78 },
  { name: 'Wed', score: 68, accuracy: 75 },
  { name: 'Thu', score: 85, accuracy: 88 },
  { name: 'Fri', score: 78, accuracy: 82 },
  { name: 'Sat', score: 92, accuracy: 94 },
  { name: 'Sun', score: 91, accuracy: 92 },
];



export function Progress() {
  const { moduleProgress } = useModuleProgress();
  
  const modulesCount = INITIAL_MODULES.length;
  const overallProgress = modulesCount > 0 
    ? Math.round(Object.values(moduleProgress).reduce((acc, curr) => acc + curr, 0) / modulesCount)
    : 0;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-serif italic text-white tracking-tight">Academic Mastery</h1>
        <p className="text-white/40 font-sans text-[10px] font-bold uppercase tracking-[0.2em]">Diagnostic Proficiency Tracking</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall Proficiency', val: `${overallProgress}%`, icon: Target, color: 'text-primary' },
          { label: 'Quiz Accuracy', val: `${overallProgress}%`, icon: Zap, color: 'text-primary' },
          { label: 'Total Study Time', val: '24h 15m', icon: Clock, color: 'text-white/20' },
          { label: 'Cards Due', val: '24', icon: Bookmark, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-4">
                <stat.icon className={cn(stat.color, "w-4 h-4")} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</span>
             </div>
             <p className="text-3xl font-bold text-white">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Proficiency Growth</h3>
            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(77,161,255,0.5)]" />
                Accuracy
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4da1ff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4da1ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)' }} />
                <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '9px', color: '#4da1ff', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#4da1ff" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Subject Mastery</h3>
          <p className="text-[9px] uppercase font-bold text-white/20 tracking-[0.2em] mb-8">Knowledge Hierarchy</p>
          <div className="flex-1 space-y-6">
            {INITIAL_MODULES.map((module) => {
              const mastery = moduleProgress[module.id] || 0;
              return (
              <div key={module.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-white/60">{module.name}</span>
                  <span className="text-primary">{mastery}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(77,161,255,0.3)]" 
                    style={{ width: `${mastery}%`, backgroundColor: '#4da1ff' }} 
                  />
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
