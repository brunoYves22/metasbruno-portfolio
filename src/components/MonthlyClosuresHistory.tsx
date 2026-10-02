import { Calendar, DollarSign, ShoppingBag, Zap } from 'lucide-react';
import { MonthlyClosure } from '@/hooks/useMonthlyClosures';
import { formatCurrency } from '@/utils/commission';

interface MonthlyClosuresHistoryProps {
  closures: MonthlyClosure[];
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function MonthlyClosuresHistory({ closures }: MonthlyClosuresHistoryProps) {
  if (closures.length === 0) {
    return (
      <div className="cockpit-card p-8 text-center">
        <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">
          Nenhum fechamento mensal registrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        Histórico de Fechamentos
      </h3>
      <div className="space-y-3">
        {closures.map((closure, index) => (
          <div 
            key={closure.id}
            className="premium-card p-5 animate-fade-in-up hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg text-foreground">
                  {MONTH_NAMES[closure.month - 1]} {closure.year}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    {closure.total_sales} vendas
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {formatCurrency(closure.total_commission)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}