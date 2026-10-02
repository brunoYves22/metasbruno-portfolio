import { Target, TrendingUp, Award, Flag, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/commission';

interface GoalStatusProps {
  currentValue: number;
  goalValue: number;
}

export function GoalStatus({ currentValue, goalValue }: GoalStatusProps) {
  const isGoalMet = currentValue >= goalValue;
  const percentage = Math.min((currentValue / goalValue) * 100, 100);
  const remaining = Math.max(goalValue - currentValue, 0);

  return (
    <div className={cn(
      'rounded-2xl p-6 transition-all duration-500',
      isGoalMet 
        ? 'achievement-card animate-pulse-glow' 
        : 'cockpit-card animate-border-glow'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-3 rounded-xl transition-all duration-300',
            isGoalMet 
              ? 'bg-white/20' 
              : 'bg-primary/20 shadow-lg shadow-primary/20'
          )}>
            <Target className={cn(
              'w-6 h-6',
              isGoalMet ? 'text-success-foreground' : 'text-primary'
            )} />
          </div>
          <div>
            <h3 className={cn(
              'text-lg font-bold',
              isGoalMet ? 'text-success-foreground' : 'text-foreground'
            )}>Meta Diária</h3>
            <p className={cn(
              'text-sm',
              isGoalMet ? 'text-success-foreground/70' : 'text-muted-foreground'
            )}>Objetivo: {formatCurrency(goalValue)}</p>
          </div>
        </div>
        {isGoalMet ? (
          <div className="badge-success animate-scale-in">
            <Award className="w-4 h-4" />
            Batida!
          </div>
        ) : (
          <div className="badge-progress">
            <TrendingUp className="w-4 h-4" />
            Em andamento
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={cn(
          'rounded-xl p-4 text-center transition-all duration-300',
          isGoalMet 
            ? 'bg-white/10' 
            : 'bg-muted/30 border border-border/50'
        )}>
          <p className={cn(
            'text-xs font-bold uppercase tracking-wider mb-1',
            isGoalMet ? 'text-success-foreground/70' : 'text-muted-foreground'
          )}>Meta</p>
          <p className={cn(
            'text-lg font-black',
            isGoalMet ? 'text-success-foreground' : 'text-foreground'
          )}>{formatCurrency(goalValue)}</p>
        </div>
        <div className={cn(
          'rounded-xl p-4 text-center transition-all duration-300',
          isGoalMet 
            ? 'bg-white/20' 
            : 'bg-primary/10 border border-primary/30'
        )}>
          <p className={cn(
            'text-xs font-bold uppercase tracking-wider mb-1',
            isGoalMet ? 'text-success-foreground/70' : 'text-primary/70'
          )}>Alcançado</p>
          <p className={cn(
            'text-lg font-black',
            isGoalMet ? 'text-success-foreground' : 'text-primary'
          )}>{formatCurrency(currentValue)}</p>
        </div>
        <div className={cn(
          'rounded-xl p-4 text-center transition-all duration-300',
          isGoalMet 
            ? 'bg-white/10' 
            : 'bg-muted/30 border border-border/50'
        )}>
          <p className={cn(
            'text-xs font-bold uppercase tracking-wider mb-1',
            isGoalMet ? 'text-success-foreground/70' : 'text-muted-foreground'
          )}>Falta</p>
          <p className={cn(
            'text-lg font-black',
            remaining === 0 ? 'text-success' : isGoalMet ? 'text-success-foreground' : 'text-foreground'
          )}>{formatCurrency(remaining)}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="progress-premium">
          <div 
            className={cn(
              'progress-premium-fill animate-progress-fill',
              isGoalMet && 'completed'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className={cn(
            'font-semibold',
            isGoalMet ? 'text-success-foreground/70' : 'text-muted-foreground'
          )}>
            {percentage.toFixed(0)}% completo
          </span>
          {isGoalMet && (
            <span className="flex items-center gap-1.5 text-success-foreground font-bold animate-scale-in">
              <Flag className="w-4 h-4" />
              Meta conquistada!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}