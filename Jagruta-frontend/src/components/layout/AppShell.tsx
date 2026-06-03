import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { TabBar } from './TabBar';
import { GlobalTour } from './GlobalTour';
import { useAppStore } from '../../store/app.store';
import { cn } from '../../lib/utils';
import i18n from '../../lib/i18n';

export const AppShell = () => {
  const { theme, language } = useAppStore();

  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className={cn(
      "relative min-h-screen w-full bg-bg-void text-text-primary overflow-x-hidden transition-colors duration-300 flex justify-center",
      theme
    )}>
      {/* Mobile Frame Container */}
      <div className={cn(
        "relative z-10 flex h-screen w-full max-w-[440px] flex-col overflow-hidden border-x border-glass-border shadow-2xl",
        theme === 'light' 
          ? "bg-white/95 backdrop-blur-md" 
          : "bg-bg-void/40 backdrop-blur-sm"
      )}>
        <TopNav />
        
        <main className="flex-1 overflow-y-auto min-w-0 pb-24">
          <div className="container mx-auto p-4">
            <Outlet />
          </div>
        </main>

        <TabBar />
        <GlobalTour />
      </div>
    </div>
  );
};
