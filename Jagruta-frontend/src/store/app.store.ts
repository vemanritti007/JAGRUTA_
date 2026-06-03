import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Constituency } from '../types/constituency';

export type MapLayer = 'ward' | 'assembly' | 'parliament';
export type Language = 'en' | 'kn' | 'hi';
export type Theme = 'dark' | 'light';

interface AppState {
  pincode: string | null;
  constituency: Constituency | null;
  mapLayer: MapLayer;
  comparePoliticians: [string, string];
  language: Language;
  theme: Theme;
  sideNavExpanded: boolean;
  hasSeenSplash: boolean;
  hasCompletedJoyrideTour: boolean;
  lastSearch: string[];
  
  // Mapbox Usage Guard
  mapboxUsageCount: number;
  lastUsageReset: string; // ISO Date

  // Actions
  setPincode: (pincode: string | null) => void;
  setConstituency: (constituency: Constituency | null) => void;
  setMapLayer: (layer: MapLayer) => void;
  setComparePoliticians: (ids: [string, string]) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setSideNavExpanded: (expanded: boolean) => void;
  setHasSeenSplash: (seen: boolean) => void;
  setHasCompletedJoyrideTour: (seen: boolean) => void;
  toggleSideNav: () => void;
  addLastSearch: (term: string) => void;
  
  // Usage Actions
  incrementMapboxUsage: () => void;
  resetMapboxUsageIfNewMonth: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      pincode: null,
      constituency: null,
      mapLayer: 'ward',
      comparePoliticians: ['', ''],
      language: 'en',
      theme: 'dark',
      sideNavExpanded: true,
      hasSeenSplash: false,
      hasCompletedJoyrideTour: false,
      lastSearch: [],
      mapboxUsageCount: 0,
      lastUsageReset: new Date().toISOString(),

      setPincode: (pincode) => set({ pincode }),
      setConstituency: (constituency) => set({ constituency }),
      setMapLayer: (layer) => set({ mapLayer: layer }),
      setComparePoliticians: (ids) => set({ comparePoliticians: ids }),
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setSideNavExpanded: (expanded) => set({ sideNavExpanded: expanded }),
      setHasSeenSplash: (seen) => set({ hasSeenSplash: seen }),
      setHasCompletedJoyrideTour: (seen) => set({ hasCompletedJoyrideTour: seen }),
      toggleSideNav: () => set((state) => ({ sideNavExpanded: !state.sideNavExpanded })),
      addLastSearch: (term) =>
        set((state) => ({
          lastSearch: [term, ...state.lastSearch.filter((t) => t !== term)].slice(0, 5),
        })),

      incrementMapboxUsage: () => set((state) => ({ mapboxUsageCount: state.mapboxUsageCount + 1 })),
      
      resetMapboxUsageIfNewMonth: () => set((state) => {
        const lastReset = new Date(state.lastUsageReset);
        const now = new Date();
        if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
          return { mapboxUsageCount: 0, lastUsageReset: now.toISOString() };
        }
        return {};
      }),
    }),
    {
      name: 'jagruta-store',
      partialize: (state) => ({
        pincode: state.pincode,
        comparePoliticians: state.comparePoliticians,
        language: state.language,
        theme: state.theme,
        sideNavExpanded: state.sideNavExpanded,
        hasCompletedJoyrideTour: state.hasCompletedJoyrideTour,
        lastSearch: state.lastSearch,
        mapboxUsageCount: state.mapboxUsageCount,
        lastUsageReset: state.lastUsageReset,
  }),
    }
  )
);
