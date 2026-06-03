import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, Minus, ArrowDown } from 'lucide-react';

interface MetricRowProps {
  label: string;
  valA: any;
  valB: any;
  higherIsBetter?: boolean;
}

export const MetricRow = ({ label, valA, valB, higherIsBetter = true }: MetricRowProps) => {
  const numA = parseFloat(valA) || 0;
  const numB = parseFloat(valB) || 0;
  
  const isABetter = higherIsBetter ? numA > numB : numA < numB;
  const isBBetter = higherIsBetter ? numB > numA : numB < numA;
  const isEqual = numA === numB;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 items-center p-6 hover:bg-glass-1 transition-colors group border-b border-glass-border last:border-0"
    >
      {/* Side A */}
      <div className={cn(
        "flex items-center gap-4 transition-all duration-500",
        isABetter ? "text-green-core font-bold scale-105" : "text-text-secondary opacity-60"
      )}>
        <span className="text-2xl font-mono">{valA}</span>
        {isABetter && <ArrowUpRight size={18} className="animate-pulse" />}
      </div>

      {/* Label */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] group-hover:text-text-primary transition-colors">
          {label}
        </span>
        <div className="flex items-center justify-center gap-2">
          <div className={cn("h-1 w-8 rounded-full transition-all duration-700", isABetter ? "bg-green-core" : "bg-glass-border")} />
          <div className={cn("h-1 w-8 rounded-full transition-all duration-700", isBBetter ? "bg-green-core" : "bg-glass-border")} />
        </div>
      </div>

      {/* Side B */}
      <div className={cn(
        "flex items-center justify-end gap-4 transition-all duration-500",
        isBBetter ? "text-green-core font-bold scale-105" : "text-text-secondary opacity-60"
      )}>
        {isBBetter && <ArrowUpRight size={18} className="animate-pulse" />}
        <span className="text-2xl font-mono">{valB}</span>
      </div>
    </motion.div>
  );
};

export const ComparisonHeader = ({ pA, pB }: { pA: any, pB: any }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-glass-1 border-b border-glass-border">
      <div className="text-left">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">CANDIDATE A</span>
        <h2 className="text-xl font-display font-bold text-text-primary">{pA?.name || '...'}</h2>
      </div>
      <div className="h-10 w-10 rounded-full bg-glass-2 border border-glass-border flex items-center justify-center text-green-core font-mono text-xs font-bold">
        VS
      </div>
      <div className="text-right">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">CANDIDATE B</span>
        <h2 className="text-xl font-display font-bold text-text-primary">{pB?.name || '...'}</h2>
      </div>
    </div>
  );
};
