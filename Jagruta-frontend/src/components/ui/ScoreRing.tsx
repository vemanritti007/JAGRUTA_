import * as React from 'react';
import { motion } from 'framer-motion';
import { cn, formatScoreColor } from '../../lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const ScoreRing = ({ score, size = 'md', className, showText = true }: ScoreRingProps) => {
  const dimensions = {
    sm: { size: 32, stroke: 3, fontSize: '10px' },
    md: { size: 48, stroke: 4, fontSize: '12px' },
    lg: { size: 64, stroke: 5, fontSize: '14px' },
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('score-ring-container', className)}>
      {/* The glow behind the ring */}
      <div 
        className="score-ring-glow" 
        style={{ 
          background: formatScoreColor(score),
          opacity: 0.3
        }} 
      />
      
      <svg width={dimensions.size} height={dimensions.size} className="-rotate-90">
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={dimensions.stroke}
        />
        <motion.circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="transparent"
          stroke={formatScoreColor(score)}
          strokeWidth={dimensions.stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, cubicBezier: [0.34, 1.56, 0.64, 1] }}
          strokeLinecap="round"
          style={{ 
            filter: `drop-shadow(0 0 4px ${formatScoreColor(score)})` 
          }}
        />
      </svg>
      {showText && (
        <span
          className="absolute font-mono font-bold"
          style={{ fontSize: dimensions.fontSize, color: 'var(--text-primary)' }}
        >
          {score}
        </span>
      )}
    </div>
  );
};
