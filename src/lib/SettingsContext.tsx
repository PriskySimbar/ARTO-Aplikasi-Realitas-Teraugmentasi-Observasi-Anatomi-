import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  showBakeButton: boolean;
  setShowBakeButton: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [showBakeButton, setShowBakeButton] = useState(() => {
    const saved = localStorage.getItem('arto_show_bake_button');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('arto_show_bake_button', JSON.stringify(showBakeButton));
  }, [showBakeButton]);

  return (
    <SettingsContext.Provider value={{ showBakeButton, setShowBakeButton }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
