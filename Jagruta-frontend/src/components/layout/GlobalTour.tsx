import * as React from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useAppStore } from '../../store/app.store';

export const GlobalTour = () => {
  const { hasCompletedJoyrideTour, setHasCompletedJoyrideTour, theme, hasSeenSplash } = useAppStore();
  const [run, setRun] = React.useState(false);

  // Use a slight effect delay to allow the DOM to fully render and animate in
  React.useEffect(() => {
    if (!hasCompletedJoyrideTour && hasSeenSplash) {
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedJoyrideTour, hasSeenSplash]);

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div className="space-y-4 text-left p-2">
          <h2 className="text-2xl font-bold font-display text-text-primary">Welcome to <span className="text-green-core">JAGRUTA</span></h2>
          <p className="text-text-secondary text-base">Let's take a quick 30-second tour to see how to use the platform effectively.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '.tour-pincode-input',
      content: 'Enter your 6-digit pin code here to find the exact Corporator, MLA, and MP representing your area.',
      disableBeacon: true,
    },
    {
      target: '.tour-nav-compare',
      content: 'Compare the criminal records, assets, and attendance of politicians side-by-side.',
      disableBeacon: true,
    },
    {
      target: '.tour-nav-guide',
      content: 'Use our AI to find which candidate actually aligns with your top priorities.',
      disableBeacon: true,
    },
    {
      target: '.tour-nav-problem, .tour-nav-more',
      content: 'Map your local civic issues to the exact official responsible for fixing them.',
      disableBeacon: true,
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    // If the tour is completed or explicitly skipped, save the state so it never runs again
    if (finishedStatuses.includes(status)) {
      setHasCompletedJoyrideTour(true);
      setRun(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: isDark ? '#1a1f2e' : '#ffffff',
          backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
          overlayColor: 'rgba(5, 7, 10, 0.85)',
          primaryColor: '#00ff87', // green-core
          textColor: isDark ? '#ffffff' : '#05070a',
          zIndex: 9999,
        },
        tooltipContainer: {
          textAlign: 'left',
          fontFamily: 'var(--font-body)',
        },
        buttonNext: {
          backgroundColor: '#00ff87',
          color: '#05070a',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '12px'
        },
        buttonBack: {
          marginRight: 10,
          color: isDark ? '#9ba1a6' : '#5f6368',
        },
        buttonSkip: {
          color: isDark ? '#9ba1a6' : '#5f6368',
        }
      }}
    />
  );
};
