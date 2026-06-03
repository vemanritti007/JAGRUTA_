import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-lg bg-glass-1 border border-glass-border px-3 py-2 text-sm text-text-primary ring-offset-bg-void file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:border-glass-border-green focus-visible:ring-2 focus-visible:ring-green-core/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-status-bad focus-visible:ring-status-bad/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-medium text-status-bad uppercase tracking-wider px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
