import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Box,
  Bell,
  User as UserIcon,
  Search,
  Activity,
  Microscope,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { useSettings } from '../lib/SettingsContext';

const NAV_ITEMS = [
  { name: 'Beranda', icon: LayoutDashboard, path: '/' },
  { name: 'ARTOLab', icon: Microscope, path: '/radiology-lab' },
  { name: 'Tomy AI Assistant', icon: Cpu, path: '/tutor' },
  { name: 'ARTOCurriculum', icon: GraduationCap, path: '/curriculum' },
];

const LECTURER_NAV_ITEMS = [
  { name: 'Portal Dosen', icon: Microscope, path: '/lecturer' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { showBakeButton, setShowBakeButton } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const allNavItems = userData?.role === 'lecturer' 
    ? [...NAV_ITEMS, ...LECTURER_NAV_ITEMS]
    : NAV_ITEMS;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* SideNavBar (Web Only) */}
      <nav className="hidden md:flex bg-[#080808] fixed left-0 top-0 h-full w-[240px] border-r border-white/10 z-40 flex-col pt-16 pb-8">
        <div className="px-8 mb-10">
          <div className="flex flex-col gap-1 mb-8">
            <img src="/logo.png" alt="ARTO Logo" className="h-10 w-auto object-contain mb-2" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h1 className="text-2xl font-serif italic tracking-tighter text-primary">
              ARTO
            </h1>
            <span className="text-[10px] font-sans not-italic font-bold tracking-[0.2em] text-white/40 uppercase">Medical 3D & AR</span>
          </div>
          <div className="h-[1px] w-full bg-white/10 mb-8" />
          <h3 className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Pusat Pengetahuan</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1">
            {allNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded border",
                      isActive
                        ? "bg-primary/5 border-primary/30 text-primary shadow-[inset_0_0_10px_rgba(77,161,255,0.05)]"
                        : "text-white/40 border-transparent hover:border-white/5 hover:text-white/80"
                    )}
                  >
                    <item.icon className={cn("mr-3 w-4 h-4", isActive ? "text-primary" : "text-white/20")} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-6 mt-auto space-y-6 pb-4">
          <div className="space-y-1">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full text-white/30 flex items-center px-4 py-2 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              <Settings className="mr-4 w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={logout}
              className="w-full text-white/30 flex items-center px-4 py-2 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              <HelpCircle className="mr-4 w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[240px] relative w-full">
        <main ref={mainRef} className="flex-1 pb-24 md:pb-8 p-3 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Bottom NavBar (Mobile Only) */}
      <nav className="md:hidden bg-[#0a0a0a] border-t border-white/10 fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-4">
         {allNavItems.slice(0, 5).map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.path}
               to={item.path}
               className={cn(
                 "flex flex-col items-center justify-center gap-1 font-bold text-[9px] uppercase tracking-widest transition-colors",
                 isActive ? "text-primary" : "text-white/30"
               )}
             >
               <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-white/20")} />
               {item.name.split(' ')[0]}
             </Link>
           );
         })}
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Pengaturan
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-white">Tampilkan BAKE / DL</h3>
                  <p className="text-[10px] text-white/40 mt-1">Sembunyikan atau tampilkan tombol Bake & Download pada 3D Model</p>
                </div>
                <button 
                  onClick={() => setShowBakeButton(!showBakeButton)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    showBakeButton ? "bg-primary" : "bg-white/20"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                    showBakeButton ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-8 bg-primary/20 text-primary py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/30 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
