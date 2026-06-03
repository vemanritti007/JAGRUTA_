import { cn } from '../../lib/utils';

function Skeleton({
  className,
  variant = 'rect',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'circle' | 'rect' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-bg-elevated',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circle' && 'h-10 w-10 rounded-full',
        variant === 'rect' && 'h-20 w-full rounded-lg',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
