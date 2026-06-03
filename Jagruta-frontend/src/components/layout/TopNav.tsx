import * as React from 'react';
import { useAppStore } from '../../store/app.store';
import { Moon, Sun, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export const TopNav = () => {
  const { language, setLanguage, theme, setTheme, pincode } = useAppStore();
  const { t } = useTranslation();

  return (
    <nav className="top-nav px-4 flex items-center justify-between shrink-0">
      {/* Brand */}
      <div className="flex flex-col shrink-0">
        <span className="wordmark text-lg">{t('app_name')}</span>
        <span className="wordmark-kannada text-[9px]">{t('app_subtext')}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Pincode Chip - Premium Flat */}
        {pincode && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glass-2 text-text-primary text-[10px] font-mono shadow-sm">
            <MapPin size={12} className="text-green-core animate-pulse" />
            <span className="font-bold tracking-wider">{pincode}</span>
          </div>
        )}

        {/* Language Switcher - Segmented Control style */}
        <div className="flex items-center p-1 rounded-lg bg-glass-2 shadow-inner">
          {(['en', 'kn'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-200",
                language === lang 
                  ? "bg-glass-3 text-text-primary shadow-sm" 
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Theme Toggle - Flat */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-glass-2 text-text-secondary hover:text-text-primary hover:bg-glass-3 transition-colors shadow-sm"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </nav>
  );
};
