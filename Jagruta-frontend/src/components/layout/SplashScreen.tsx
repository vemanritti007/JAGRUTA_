import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/app.store';
import { SaveButton } from '../ui/SaveButton';
import { useTranslation } from 'react-i18next';

export const SplashScreen = () => {
  const { hasSeenSplash, setHasSeenSplash } = useAppStore();
  const { t } = useTranslation();

  if (hasSeenSplash) return null;

  const handleEnter = async () => {
    // Add a slight delay to allow the "saved" confetti animation to play before unmounting
    await new Promise(r => setTimeout(r, 600));
    setHasSeenSplash(true);
  };

  const word = "JAGRUTA".split('');
  const defaultTagline = "KNOW WHO TO VOTE FOR. KNOW WHO TO BLAME.";

  return (
    <AnimatePresence>
      {!hasSeenSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-void overflow-hidden"
        >
          <div className="relative w-full h-full max-w-[440px] md:h-screen md:border-x md:border-glass-border bg-transparent flex flex-col items-center justify-between px-4 pt-8 pb-16 z-10">
            
            {/* Spacer to push logo to center */}
            <div />

            {/* Premium Staggered Letter Animation Sequence */}
            <div className="flex flex-col items-center gap-6 w-full text-center">
              <div className="flex justify-center items-end w-full px-2" style={{ gap: 0 }}>
                {word.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.23, 1, 0.32, 1],
                      delay: index * 0.08,
                    }}
                    className="font-display font-medium text-text-primary drop-shadow-sm"
                    style={{ fontSize: 'clamp(28px, 10vw, 72px)', letterSpacing: '0.04em' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: word.length * 0.08 + 0.6, duration: 1.2, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-xl font-body text-text-secondary tracking-[0.15em] opacity-90" style={{ fontFamily: '"Anek Kannada", sans-serif' }}>
                  {t('app_subtext') || 'ಜಾಗೃತ'}
                </h2>
                <div className="w-full flex justify-center">
                  <p className="font-mono text-[11px] font-medium text-text-muted tracking-[0.25em] uppercase max-w-[280px] leading-relaxed">
                    {t('tagline') || defaultTagline}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Enter Button — pinned to bottom via flex justify-between */}
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: word.length * 0.08 + 1.2, duration: 0.8, ease: "easeOut" }}
              className="w-full flex flex-col items-center px-8 gap-4"
            >
              <SaveButton 
                onSave={handleEnter}
                text={{ idle: t('enter_app') || 'ENTER JAGRUTA', saving: 'ENTERING...', saved: 'WELCOME!' }}
                className="w-full max-w-[280px]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
