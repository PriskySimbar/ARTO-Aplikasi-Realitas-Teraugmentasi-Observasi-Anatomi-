import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FileSearch, 
  Upload, 
  X, 
  Activity, 
  Brain, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Info,
  Stethoscope,
  Microscope,
  FileJson,
  Crosshair,
  Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { analyzeMedicalImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AnatomyLabel {
  name: string;
  location: string;
  coords: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
}

export function RadiologyLab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // Extract visual labels from Gemini's JSON block
  const visualLabels = useMemo(() => {
    if (!analysis) return [];
    try {
      const match = analysis.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1].trim());
        return (Array.isArray(parsed) ? parsed : []).filter(item => item.coords && item.coords.length === 4) as AnatomyLabel[];
      }
    } catch (e) {
      console.warn("Failed to parse visual labels", e);
    }
    return [];
  }, [analysis]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysis(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMedicalImage(file);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menganalisis gambar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-primary">
          <Microscope className="w-6 h-6 shadow-[0_0_15px_#4da1ff]" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em]">Laboratorium ARTO</h1>
        </div>
        <h2 className="text-4xl font-serif italic text-white tracking-tight">ARTO<span className="text-primary">Lab</span></h2>
        <p className="text-slate-400 max-w-2xl text-xs uppercase tracking-widest leading-relaxed">
          Sistem deteksi cerdas untuk identifikasi struktur anatomis pada citra radiologi menggunakan Neural Atlas Expert v4.2.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input/Visual Section */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 lg:sticky lg:top-10">
          {!preview ? (
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-3xl p-12 transition-all duration-500 flex flex-col items-center justify-center gap-6 min-h-[400px] group cursor-pointer",
                isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-white/20 bg-[#0a0a0a]"
              )}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/5">
                <Upload className={cn("w-8 h-8 transition-colors", isDragActive ? "text-primary" : "text-white/20")} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-white uppercase tracking-widest">Upload Modalitas Citra</p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">JPEG, PNG, DICOM (Converted)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black group shadow-3xl">
                {/* Background Image */}
                <img src={preview} alt="Medical Preview" className="w-full aspect-auto object-contain bg-[#050505] min-h-[400px]" />
                
                {/* Visual Labels Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {visualLabels.map((label, idx) => {
                    const [ymin, xmin, ymax, xmax] = label.coords;
                    const isHovered = hoveredLabel === label.name;
                    return (
                      <motion.div
                        key={idx}
                        className={cn(
                          "absolute border-2 transition-all duration-300",
                          isHovered ? "border-secondary bg-secondary/10 shadow-[0_0_20px_#71f8e4]" : "border-primary/40 bg-primary/5"
                        )}
                        style={{
                          top: `${ymin / 10}%`,
                          left: `${xmin / 10}%`,
                          width: `${(xmax - xmin) / 10}%`,
                          height: `${(ymax - ymin) / 10}%`,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className={cn(
                          "absolute -top-6 left-0 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300",
                          isHovered ? "bg-secondary text-black" : "bg-primary text-black opacity-0 group-hover:opacity-100"
                        )}>
                          {label.name}
                        </div>
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/20" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/20" />
                      </motion.div>
                    );
                  })}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <Crosshair className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Neural Scanning Active</span>
                  </div>
                </div>

                <button 
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/60 hover:text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={cn(
                    "flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden",
                    loading ? "bg-white/5 text-white/20 cursor-wait" : (analysis ? "bg-white/5 text-white/40 border border-white/10" : "bg-primary text-black hover:brightness-110 active:scale-95")
                  )}
                >
                  {loading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Diagnostic Active...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>{analysis ? 'AI Diagnosis Ready' : 'Identify Anatomy'}</span>
                    </>
                  )}
                </button>
                {analysis && (
                   <button 
                   onClick={removeFile}
                   className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
                 >
                   <X className="w-5 h-5" />
                 </button>
                )}
              </div>
            </div>
          )}

          {/* Feature Highlight */}
          <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl space-y-4">
             <div className="flex items-center gap-3">
               <Maximize className="w-4 h-4 text-secondary" />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mapping Capability</span>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed italic">
               Sensor visual kami memetakan koordinat spasial struktur anatomi pada 800+ titik modalitas. Arahkan kursor pada kartu data untuk menyorot area pada gambar.
             </p>
          </div>
        </div>

        {/* Analysis/Results Section */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className={cn(
            "h-full min-h-[600px] border border-white/10 rounded-3xl bg-[#0a0a0a] overflow-hidden flex flex-col relative",
            !analysis && "items-center justify-center text-center p-12"
          )}>
            {!analysis && !loading ? (
              <div className="space-y-6 py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto animate-pulse">
                  <FileSearch className="w-10 h-10 text-white/10" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Neural Diagnostic Node</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest max-w-xs mx-auto italic leading-relaxed">
                    Unggah citra rontgen atau MRI untuk memulai identifikasi struktur anatomi digital secara otomatis.
                  </p>
                </div>
              </div>
            ) : analysis ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md py-4 z-20 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#71f8e4] animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Morphology Report</span>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                    Expert Accuracy: High
                  </div>
                </div>

                <div className="prose prose-invert prose-sm max-w-none 
                  prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-primary prose-headings:mb-6
                  prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-serif prose-p:italic prose-p:mb-6
                  prose-strong:text-white prose-strong:font-black
                  prose-ul:text-white/60 prose-li:mb-2 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl"
                >
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isJson = match && match[1] === 'json';
                        if (isJson) {
                          try {
                            const data = JSON.parse(String(children).trim());
                            return (
                              <div className="my-8 space-y-3">
                                <div className="grid grid-cols-1 gap-3">
                                  {data.map((item: any, i: number) => (
                                    <motion.div 
                                      key={i}
                                      onMouseEnter={() => setHoveredLabel(item.name)}
                                      onMouseLeave={() => setHoveredLabel(null)}
                                      className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group cursor-default",
                                        hoveredLabel === item.name ? "bg-primary/10 border-primary shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20"
                                      )}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] transition-all",
                                          hoveredLabel === item.name ? "bg-primary text-black" : "bg-white/5 text-white/40"
                                        )}>
                                          0{i + 1}
                                        </div>
                                        <div>
                                          <p className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">{item.name}</p>
                                          <p className="text-[9px] text-white/40 uppercase tracking-widest italic">{item.location}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="h-px w-8 bg-white/5 group-hover:w-12 transition-all group-hover:bg-primary/40" />
                                        <Crosshair className={cn("w-4 h-4 transition-colors", hoveredLabel === item.name ? "text-primary" : "text-white/10")} />
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            );
                          } catch (e) {
                             return <code className={className} {...props}>{children}</code>;
                          }
                        }
                        return <code className={className} {...props}>{children}</code>;
                      }
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/5 border border-secondary/10">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Diagnostic Finalized</p>
                      <p className="text-[9px] text-white/40 font-medium italic leading-relaxed">Laboratorium ini menggunakan model Gemini 1.5 Flash untuk analisis radiologi tingkat lanjut.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 py-32">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border border-primary/20 animate-ping absolute inset-0" />
                  <div className="w-32 h-32 rounded-full border-2 border-primary/10 border-t-primary animate-spin relative flex items-center justify-center backdrop-blur-3xl">
                    <Brain className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-base font-black text-white uppercase tracking-[0.5em] animate-pulse">Analyzing...</span>
                    <span className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.3em]">Extracting Morphological Data</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-xl z-50">
          <AlertCircle className="w-5 h-5" />
          <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}
    </div>
  );
}
