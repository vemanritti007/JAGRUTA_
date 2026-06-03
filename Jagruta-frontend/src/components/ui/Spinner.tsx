import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner = ({ size = 24, className }: SpinnerProps) => {
  return <Loader2 size={size} className={cn('animate-spin text-accent-green', className)} />;
};

export { Spinner };
