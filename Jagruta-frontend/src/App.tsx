import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './lib/trpc';
import { queryClient } from './lib/queryClient';
import { router } from './router';
import { httpBatchLink } from '@trpc/client';
import { useAppStore } from './store/app.store';
import { SplashScreen } from './components/layout/SplashScreen';
import './lib/i18n';
import i18n from 'i18next';

export const App = () => {
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
        }),
      ],
    })
  );

  const { theme, language } = useAppStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SplashScreen />
        <React.Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-bg-void overflow-hidden relative">
              {/* Mesh background for loader too */}
              <div className="bg-mesh">
                <div className="bg-orb bg-orb-1" />
                <div className="bg-grid" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="h-16 w-16 animate-spin rounded-full border-2 border-green-core border-b-transparent shadow-glow" />
                <div className="text-center space-y-1">
                  <span className="wordmark block text-3xl">JAGRUTA</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-green-core animate-pulse">Initializing Civic Intel...</span>
                </div>
              </div>
            </div>
          }
        >
          <RouterProvider router={router} />
        </React.Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
