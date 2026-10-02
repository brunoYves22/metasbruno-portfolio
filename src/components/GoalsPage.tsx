import { Target, Calendar, Trophy, TrendingUp, CheckCircle2, Award, Flag, Zap } from 'lucide-react';
import { DailyGoalAchieved, MonthlyGoalAchieved } from '@/types/goals';
import { formatCurrency } from '@/utils/commission';
import { cn } from '@/lib/utils';

interface GoalsPageProps {
  dailyGoalsAchieved: DailyGoalAchieved[];
  monthlyGoalsAchieved: MonthlyGoalAchieved[];
  dailyGoalValue: number;
  monthlyGoalValue: number;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function GoalsPage({ 
  dailyGoalsAchieved, 
  monthlyGoalsAchieved,
  dailyGoalValue,
  monthlyGoalValue
}: GoalsPageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="space-y-8 stagger-children">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Daily Goals Counter */}
        <div className="hero-card">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/20">
                <Target className="w-5 h-5" />
              </div>
              <span className="stat-label">Metas Diárias</span>
            </div>
            <p className="stat-value-lg">
              {dailyGoalsAchieved.length}
            </p>
            <p className="text-sm opacity-70 mt-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              dias com meta batida
            </p>
          </div>
        </div>

        {/* Monthly Goals Counter */}
        <div className="achievement-card">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/20">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="stat-label">Metas Mensais</span>
            </div>
            <p className="stat-value-lg">
              {monthlyGoalsAchieved.length}
            </p>
            <p className="text-sm opacity-70 mt-2 flex items-center gap-1.5">
              <Flag className="w-4 h-4" />
              meses com meta batida
            </p>
          </div>
        </div>
      </div>

      {/* Goal Values Info */}
      <div className="cockpit-card">
        <div className="relative z-10 flex items-center gap-4 text-sm flex-wrap">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">Meta Diária: <strong className="text-primary">{formatCurrency(dailyGoalValue)}</strong></span>
          <span className="text-border">•</span>
          <span className="text-muted-foreground">Meta Mensal: <strong className="text-primary">{formatCurrency(monthlyGoalValue)}</strong></span>
        </div>
      </div>

      {/* Monthly Goals Section */}
      <div className="space-y-4">
        <h3 className="text-title text-foreground flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-success/20 shadow-lg shadow-success/20">
            <Trophy className="w-5 h-5 text-success" />
          </div>
          Metas Mensais Batidas
        </h3>
        
        {monthlyGoalsAchieved.length === 0 ? (
          <div className="cockpit-card p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Nenhuma meta mensal batida ainda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyGoalsAchieved.map((goal, index) => (
              <div
                key={goal.id}
                className="cockpit-card p-5 flex items-center justify-between animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success/80 shadow-lg shadow-success/30">
                    <Flag className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {MONTH_NAMES[goal.month - 1]} {goal.year}
                    </p>
                    <p className="text-sm text-muted-foreground">{goal.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">
                    {formatCurrency(goal.total_commission)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Goals Section */}
      <div className="space-y-4">
        <h3 className="text-title text-foreground flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/15 shadow-lg shadow-primary/20">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          Metas Diárias Batidas
        </h3>
        
        {dailyGoalsAchieved.length === 0 ? (
          <div className="cockpit-card p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Nenhuma meta diária batida ainda
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {dailyGoalsAchieved.map((goal, index) => (
              <div
                key={goal.id}
                className="premium-card p-5 flex items-center justify-between animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground capitalize">
                      {formatDate(goal.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">{goal.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">
                    {formatCurrency(goal.total_commission)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}