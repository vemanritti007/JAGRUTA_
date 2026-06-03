import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'badge',
  {
    variants: {
      variant: {
        default: 'bg-glass-2 border-glass-border text-text-secondary',
        party: '', // Handle separately via party prop
        status: '', // Handle separately via status prop
        level: 'level-badge',
      },
      party: {
        BJP: 'badge-bjp',
        INC: 'badge-inc',
        JDS: 'badge-jds',
        IND: 'badge-ind',
      },
      status: {
        fulfilled: 'badge-fulfilled',
        'in-progress': 'badge-in-progress',
        broken: 'badge-broken',
      },
      level: {
        corporator: 'level-corporator',
        mla: 'level-mla',
        mp: 'level-mp',
      }
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, party, status, level, ...props }: BadgeProps) {
  // Map party/status/level to specific classes if provided
  const extraClasses = cn(
    variant === 'party' && party && `badge-${party.toLowerCase()}`,
    variant === 'status' && status && `badge-${status.toLowerCase()}`,
    variant === 'level' && level && `level-badge level-${level.toLowerCase()}`
  );

  return (
    <div 
      className={cn(badgeVariants({ variant }), extraClasses, className)} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
