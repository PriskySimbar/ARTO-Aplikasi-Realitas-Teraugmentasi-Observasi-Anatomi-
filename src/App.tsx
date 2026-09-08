/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { SettingsProvider } from './lib/SettingsContext';
import { AppLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Tutor } from './pages/Tutor';
import { Curriculum } from './pages/Curriculum';
import { Progress } from './pages/Progress';
import { RadiologyLab } from './pages/RadiologyLab';
import { LecturerDashboard } from './pages/LecturerDashboard';
import { useGLTF } from '@react-three/drei';
import { INITIAL_MODULES } from './constants';

function AuthenticatedRoutes() {
  const { user, userData, loading, isSigningIn, signIn } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-surface text-primary">Loading...</div>;

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-surface gap-6">
        <h1 className="text-4xl font-black text-white">AR<span className="text-primary">TO</span></h1>
        <p className="text-slate-400">Please sign in to access the medical platform.</p>
        <button 
          onClick={signIn}
          disabled={isSigningIn}
          className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:moduleId" element={<Library />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/radiology-lab" element={<RadiologyLab />} />
        {userData?.role === 'lecturer' && <Route path="/lecturer" element={<LecturerDashboard />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <AuthenticatedRoutes />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

