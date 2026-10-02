import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon?: ReactNode;
  variant?: 'default' | 'hero' | 'achievement' | 'dark' | 'cockpit';
  className?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, variant = 'default', className, subtitle }: StatCardProps) {
  const cardClass = cn(
    'hover-lift',
    variant === 'default' && 'premium-card',
    variant === 'hero' && 'hero-card',
    variant === 'achievement' && 'achievement-card',
    variant === 'dark' && 'dark-card',
    variant === 'cockpit' && 'cockpit-card',
    className
  );

  return (
    <div className={cardClass}>
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="stat-label">
            {title}
          </p>
          <div className={cn(
            'text-3xl sm:text-4xl font-black tracking-tight',
            variant === 'default' && 'text-foreground',
            variant === 'cockpit' && 'text-primary'
          )}>
            {value}
          </div>
          {subtitle && (
            <p className={cn(
              'text-sm mt-2',
              variant === 'hero' || variant === 'achievement' ? 'opacity-70' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
            variant === 'default' ? 'bg-primary/10 text-primary' : 
            variant === 'cockpit' ? 'bg-primary/20 text-primary' :
            'bg-white/20'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}