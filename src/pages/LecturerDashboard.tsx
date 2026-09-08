import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  BrainCircuit, 
  Save, 
  Trash2, 
  TrendingUp, 
  CheckCircle2,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp, where, orderBy, doc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { INITIAL_MODULES } from '../constants';
import { generateQuiz } from '../services/geminiService';
import { Quiz, QuizQuestion, UserQuizResult, UserModuleProgress } from '../types';
import { useAuth } from '../lib/AuthContext';

export function LecturerDashboard() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'monitoring' | 'quizzes'>('monitoring');
  const [students, setStudents] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState(INITIAL_MODULES[0].id);
  
  // Monitoring Detail State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Quiz Creation State
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    // Real-time student monitoring
    const path = 'users';
    const q = query(collection(db, path), where('role', '==', 'student'));
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const studentList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
    }, (e) => {
      handleFirestoreError(e, OperationType.LIST, path);
    });

    fetchQuizzes();
    
    return () => unsubscribe();
  }, []);

  const fetchStudentResults = async (studentId: string) => {
    setIsLoadingDetails(true);
    const path = 'user_quiz_results';
    try {
      const q = query(
        collection(db, path), 
        where('userId', '==', studentId),
        orderBy('completedAt', 'desc')
      );
      const snap = await getDocs(q);
      setStudentResults(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    fetchStudentResults(student.uid);
  };

  const fetchQuizzes = async () => {
    const path = 'quizzes';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  };

  const handleGenerateAIQuiz = async () => {
    setIsGenerating(true);
    try {
      const module = INITIAL_MODULES.find(m => m.id === selectedModuleForQuiz);
      const questions = await generateQuiz(module?.name || 'General Anatomy', 'Clinical');
      setNewQuizQuestions(questions);
      setNewQuizTitle(`Ujian AI: ${module?.name}`);
      setShowQuizForm(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!newQuizTitle || newQuizQuestions.length === 0) return;

    const path = 'quizzes';
    try {
      await addDoc(collection(db, path), {
        moduleId: selectedModuleForQuiz,
        title: newQuizTitle,
        questions: newQuizQuestions,
        createdBy: userData?.uid,
        createdAt: new Date().toISOString(),
      });
      setShowQuizForm(false);
      setNewQuizQuestions([]);
      setNewQuizTitle('');
      fetchQuizzes();
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const path = `quizzes/${quizId}`;
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      fetchQuizzes();
      setDeleteConfirmId(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif italic text-white tracking-tight">Portal Dosen</h1>
          <p className="text-white/40 font-sans text-[10px] font-bold uppercase tracking-[0.2em]">Manajemen Kurikulum & Monitor Progress</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('monitoring')}
            className={cn(
              "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'monitoring' ? "bg-primary text-black" : "text-white/40 hover:text-white"
            )}
          >
            Monitor Mahasiswa
          </button>
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={cn(
              "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'quizzes' ? "bg-primary text-black" : "text-white/40 hover:text-white"
            )}
          >
            Kelola Kuis
          </button>
        </div>
      </header>

      {activeTab === 'monitoring' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Daftar Mahasiswa
                  </h3>
                  <span className="text-[10px] text-white/40 font-mono">{students.length} Terdaftar</span>
               </div>
               <div className="divide-y divide-white/5">
                 {students.map(student => (
                   <div 
                     key={student.uid} 
                     onClick={() => handleSelectStudent(student)}
                     className={cn(
                       "p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer",
                       selectedStudent?.uid === student.uid && "bg-white/5 border-l-2 border-primary"
                     )}
                   >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                          {student.photoURL ? (
                            <img src={student.photoURL} alt="" className="w-full h-full rounded-full" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{student.displayName?.[0] || 'S'}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{student.displayName}</h4>
                          <p className="text-[10px] text-white/40 italic">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                           <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Skor Rata-rata</p>
                           <p className="text-sm font-mono font-bold text-primary">{student.overallScore || 0}%</p>
                         </div>
                         <button className="p-2 text-white/20 hover:text-white transition-colors">
                           <Eye className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {selectedStudent && (
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-primary/5">
                  <div>
                    <h3 className="text-sm font-bold text-white">Riwayat Kuis: {selectedStudent.displayName}</h3>
                    <p className="text-[10px] text-white/40 italic">Detail performa kuis mahasiswa terpilih</p>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest"
                  >
                    Tutup
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {isLoadingDetails ? (
                    <div className="p-10 text-center text-white/20 italic text-xs">Memuat data...</div>
                  ) : studentResults.length === 0 ? (
                    <div className="p-10 text-center text-white/20 italic text-xs">Belum ada kuis yang diselesaikan.</div>
                  ) : (
                    <div className="space-y-3">
                      {studentResults.map(result => {
                         const module = INITIAL_MODULES.find(m => m.id === result.moduleId);
                         return (
                           <div key={result.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                             <div>
                               <p className="text-xs font-bold text-white mb-1">{module?.name || 'Modul Tidak Diketahui'}</p>
                               <p className="text-[10px] text-white/40 font-mono italic">Selesai: {new Date(result.completedAt).toLocaleString()}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-lg font-mono font-bold text-primary">{result.percentage}%</p>
                               <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Skor: {result.score}/{result.total}</p>
                             </div>
                           </div>
                         );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
               <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/10" />
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Insight Kelas</h3>
               <div className="space-y-4 relative z-10">
                 <div>
                   <p className="text-[24px] font-serif italic text-white">85%</p>
                   <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Rata-rata Kelulusan</p>
                 </div>
                 <div className="h-[1px] w-full bg-white/10" />
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-bold text-white">4.2</p>
                      <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Kuis / Mahasiswa</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">12h</p>
                      <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Waktu Belajar Avg</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Modul Terpopuler</h4>
              <div className="space-y-3">
                {INITIAL_MODULES.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center justify-between">
                    <span className="text-xs text-white/80">{m.name}</span>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">92%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">Buat Kuis Baru</h3>
                  <div className="space-y-4">
                     <div>
                       <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Pilih Modul</label>
                       <select 
                         value={selectedModuleForQuiz}
                         onChange={(e) => setSelectedModuleForQuiz(e.target.value)}
                         className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                       >
                         {INITIAL_MODULES.map(m => (
                           <option className="bg-[#111111] text-white" key={m.id} value={m.id}>{m.name}</option>
                         ))}
                       </select>
                     </div>
                     <button 
                       onClick={handleGenerateAIQuiz}
                       disabled={isGenerating}
                       className="w-full bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2"
                     >
                       {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                       {isGenerating ? 'Membuat...' : 'Buat dengan AI'}
                     </button>
                     <div className="relative flex items-center justify-center py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative bg-[#0a0a0a] px-2 text-[8px] text-white/20 uppercase font-black tracking-widest">Atau Manual</span>
                     </div>
                     <button 
                       onClick={() => {
                         setShowQuizForm(true);
                         setNewQuizQuestions([{ question: '', options: ['', '', '', ''], answer: 0, explanation: '' }]);
                       }}
                       className="w-full bg-white/5 border border-white/10 text-white/60 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                     >
                       <Plus className="w-4 h-4" />
                       Tulis Kuis Manual
                     </button>
                  </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8">
            {showQuizForm ? (
              <div className="bg-[#0a0a0a] border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(77,161,255,0.05)]">
                 <div className="p-6 border-b border-white/10 flex items-center justify-between bg-primary/5">
                   <input 
                     type="text" 
                     value={newQuizTitle}
                     onChange={(e) => setNewQuizTitle(e.target.value)}
                     placeholder="Judul Kuis..."
                     className="bg-transparent text-lg font-bold text-white focus:outline-none placeholder:text-white/20 w-full"
                   />
                   <div className="flex items-center gap-3">
                     <button onClick={() => setShowQuizForm(false)} className="text-white/40 text-[10px] uppercase font-bold hover:text-white">Batal</button>
                     <button 
                       onClick={handleSaveQuiz}
                       className="bg-primary text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                     >
                       <Save className="w-4 h-4" />
                       Simpan Kuis
                     </button>
                   </div>
                 </div>
                 <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
                    {newQuizQuestions.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10 relative group">
                        <button 
                          onClick={() => setNewQuizQuestions(newQuizQuestions.filter((_, i) => i !== qIndex))}
                          className="absolute top-4 right-4 text-white/20 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div>
                          <label className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 block">Pertanyaan {qIndex + 1}</label>
                          <textarea 
                            value={q.question}
                            onChange={(e) => {
                              const newQs = [...newQuizQuestions];
                              newQs[qIndex].question = e.target.value;
                              setNewQuizQuestions(newQs);
                            }}
                            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                            placeholder="Ketik pertanyaan medis di sini..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                checked={q.answer === oIndex}
                                onChange={() => {
                                  const newQs = [...newQuizQuestions];
                                  newQs[qIndex].answer = oIndex;
                                  setNewQuizQuestions(newQs);
                                }}
                                className="accent-primary"
                              />
                              <input 
                                type="text" 
                                value={opt}
                                onChange={(e) => {
                                  const newQs = [...newQuizQuestions];
                                  newQs[qIndex].options[oIndex] = e.target.value;
                                  setNewQuizQuestions(newQs);
                                }}
                                className="flex-1 bg-white/5 border border-white/5 rounded px-3 py-1.5 text-xs text-white/80 focus:border-primary/30 outline-none"
                                placeholder={`Opsi ${oIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 block">Penjelasan Klinis</label>
                          <input 
                            type="text" 
                            value={q.explanation}
                            onChange={(e) => {
                              const newQs = [...newQuizQuestions];
                              newQs[qIndex].explanation = e.target.value;
                              setNewQuizQuestions(newQs);
                            }}
                            className="w-full bg-transparent text-[10px] text-white/40 focus:outline-none italic"
                            placeholder="Mengapa jawaban ini benar?"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setNewQuizQuestions([...newQuizQuestions, { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }])}
                      className="w-full py-4 border border-dashed border-white/10 rounded-xl text-white/20 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Pertanyaan
                    </button>
                 </div>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-primary" />
                    Kuis Terbitan
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {quizzes.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                       <BookOpen className="w-12 h-12 text-white/5 mx-auto" />
                       <p className="text-xs text-white/20 italic">Belum ada kuis yang diterbitkan.</p>
                    </div>
                  ) : (
                    quizzes.map(quiz => (
                      <div key={quiz.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all group">
                         <div className="space-y-1">
                           <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{quiz.title}</h4>
                           <div className="flex items-center gap-3">
                              <span className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/40 uppercase font-black tracking-widest">
                                {INITIAL_MODULES.find(m => m.id === quiz.moduleId)?.name}
                              </span>
                              <span className="text-[8px] text-white/20 font-mono italic">{quiz.questions.length} Pertanyaan</span>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-[9px] font-mono text-white/20">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                            {deleteConfirmId === quiz.id ? (
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                  className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-bold"
                                >
                                  Hapus
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-white/10 text-white/60 hover:bg-white/20 rounded text-xs font-bold"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(quiz.id)}
                                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
