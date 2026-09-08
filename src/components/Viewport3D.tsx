import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Box } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Viewport3DProps {
  src: string;
  poster?: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
}

export function Viewport3D({ src, poster, alt, autoRotate = true, cameraControls = true, ar = true }: Viewport3DProps) {
  const modelViewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const onProgress = (event: any) => {
      const p = event.detail.totalProgress || 0;
      setProgress(p);
      if (p >= 1) setLoading(false);
    };
    
    const onLoad = () => {
      setLoading(false);
      setProgress(1);
    };

    const onError = (e: any) => {
      console.error('Model loading error:', e);
      setLoading(false);
    };

    viewer.addEventListener('progress', onProgress);
    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    // If it's already loaded
    if (viewer.loaded) {
      onLoad();
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => {
      viewer.removeEventListener('progress', onProgress);
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
      clearTimeout(timeout);
    };
  }, [src]);

  const handleARClick = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] rounded-xl overflow-hidden relative border border-white/5 flex flex-col">
      {loading && (
        <div className="absolute inset-0 z-30 bg-[#050505] flex flex-col items-center justify-center gap-4">
          <div className="relative w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 shadow-[0_0_8px_rgba(77,161,255,0.5)]" 
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse text-center">Calibrating Model Mesh</span>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{Math.round(progress * 100)}% Synced</span>
          </div>
        </div>
      )}

      {isInIframe && (
        <div className="absolute top-16 left-4 right-4 z-40 bg-red-500/20 border border-red-500/40 p-4 rounded-xl backdrop-blur-xl flex flex-col items-center gap-2 shadow-2xl pointer-events-auto">
          <p className="text-[10px] font-black text-red-100 uppercase tracking-[0.2em]">Preview restricted</p>
          <p className="text-[9px] text-red-200/60 uppercase tracking-widest text-center leading-relaxed">
            AR requires a full browser session. Click <span className="text-white font-bold">"LAUNCH BROWSER"</span> at the top right, then return here to enter AR.
          </p>
        </div>
      )}
      
      {/* @ts-ignore */}
      <model-viewer
        id="main-model-viewer"
        ref={modelViewerRef}
        src={src}
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        environment-image="neutral"
        ar
        ar-modes="scene-viewer webxr quick-look"
        ar-placement="floor"
        ar-scale="auto"
        loading="eager"
        reveal="auto"
        auto-rotate={autoRotate ? '' : undefined}
        alt={alt || "3D Anatomical Model"}
        style={{ width: '100%', height: '100%', flex: '1', minHeight: '500px', backgroundColor: '#050505', display: 'block' }}
      >
        <div slot="poster" className="absolute inset-0 bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-primary/20 rounded-full border-t-primary animate-spin" />
        </div>

        <div className="absolute top-4 left-4 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none z-10 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#71f8e4] animate-pulse"></div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Scan Active</span>
        </div>
        
        {/* Manual AR trigger for better reliability */}
        {!loading && (
          <button 
            onClick={handleARClick}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-primary text-black px-10 py-5 rounded-full font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(77,161,255,0.6)] active:scale-95 transition-all z-[100] border-2 border-white/30"
          >
            <Box className="w-6 h-6" />
            Launch Medical AR
          </button>
        )}
        {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}
