import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import * as React from 'react';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const PoliticianPage = React.lazy(() => import('./pages/PoliticianPage'));
const ComparePage = React.lazy(() => import('./pages/ComparePage'));
const VotingGuidePage = React.lazy(() => import('./pages/VotingGuidePage'));
const ProblemMapperPage = React.lazy(() => import('./pages/ProblemMapperPage'));
const ElectionResultsPage = React.lazy(() => import('./pages/ElectionResultsPage'));
const ManifestoPage = React.lazy(() => import('./pages/ManifestoPage'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const ReportCardPage = React.lazy(() => import('./pages/ReportCardPage'));
const MorePage = React.lazy(() => import('./pages/MorePage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'politician/:id', element: <PoliticianPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'voting-guide', element: <VotingGuidePage /> },
      { path: 'problem-mapper', element: <ProblemMapperPage /> },
      { path: 'elections', element: <ElectionResultsPage /> },
      { path: 'manifesto', element: <ManifestoPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'report/:id?', element: <ReportCardPage /> },
      { path: 'more', element: <MorePage /> },
    ],
  },
]);
