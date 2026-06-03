import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Map, Search, ArrowLeftRight, Sparkles, AlertCircle, 
  BarChart3, FileText, Calendar, LayoutDashboard, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useAppStore } from '../../store/app.store';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export const SideNav = () => {
  const { sideNavExpanded, toggleSideNav } = useAppStore();
  const { t } = useTranslation();

  const navItems = [
    { icon: LayoutDashboard, label: t('nav_home'), path: '/' },
    { icon: Map, label: t('nav_map'), path: '/map' },
    { icon: ArrowLeftRight, label: t('nav_compare'), path: '/compare' },
    { icon: Sparkles, label: t('nav_guide'), path: '/voting-guide' },
    { icon: AlertCircle, label: t('nav_problem'), path: '/problem-mapper' },
    { icon: BarChart3, label: t('nav_results'), path: '/elections' },
    { icon: FileText, label: t('nav_manifesto'), path: '/manifesto' },
    { icon: Calendar, label: t('nav_calendar'), path: '/calendar' },
    { icon: Search, label: t('nav_report'), path: '/report' },
  ];

  return (
    <div 
      className={cn(
        "side-nav transition-all duration-300",
        sideNavExpanded ? "w-[240px]" : "w-[64px] items-center px-2"
      )}
    >
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "nav-item group",
              isActive && "active",
              !sideNavExpanded && "justify-center p-3",
              item.path === '/compare' && 'tour-nav-compare',
              item.path === '/voting-guide' && 'tour-nav-guide',
              item.path === '/problem-mapper' && 'tour-nav-problem'
            )}
          >
            <item.icon 
              className={cn(
                "nav-icon h-5 w-5 shrink-0 transition-all",
                "group-hover:scale-110"
              )} 
            />
            {sideNavExpanded && (
              <span className="truncate">{item.label}</span>
            )}
            {!sideNavExpanded && (
              <div className="absolute left-full ml-4 px-2 py-1 rounded bg-bg-depth border border-glass-border text-xs text-text-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <button 
        onClick={toggleSideNav}
        className="mt-auto flex items-center justify-center h-10 w-full rounded-lg bg-glass-1 border border-glass-border text-text-secondary hover:text-text-primary hover:bg-glass-2 transition-all"
      >
        {sideNavExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className={cn(
        "mt-4 pt-4 border-t border-glass-border text-[10px] text-text-muted font-mono uppercase tracking-widest",
        !sideNavExpanded && "text-center"
      )}>
        {sideNavExpanded ? "v0.1.0-alpha" : "0.1"}
      </div>
    </div>
  );
};
