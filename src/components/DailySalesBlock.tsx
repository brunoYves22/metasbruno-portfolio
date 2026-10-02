import { Trophy, Target, TrendingDown, Package, User, Flag, Zap, Edit3 } from 'lucide-react';
import { Sale } from '@/types/sale';
import { formatCurrency } from '@/utils/commission';
import { cn } from '@/lib/utils';

interface DailySalesBlockProps {
  date: string;
  sales: Sale[];
  dailyGoal: number;
  onSaleClick?: (sale: Sale) => void;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function DailySalesBlock({ date, sales, dailyGoal, onSaleClick }: DailySalesBlockProps) {
  const totalCommission = sales
    .filter(sale => sale.recognized)
    .reduce((sum, sale) => sum + sale.commission, 0);
  
  const isGoalMet = totalCommission >= dailyGoal;
  const remaining = dailyGoal - totalCommission;
  
  const dateObj = new Date(date + 'T12:00:00');
  const dayName = DAY_NAMES[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden transition-all duration-500 hover-lift",
      isGoalMet 
        ? "day-block goal-met"
        : "day-block"
    )}>
      {/* Header */}
      <div className={cn(
        "px-5 py-4 flex items-center justify-between",
        isGoalMet 
          ? "bg-gradient-to-r from-success/10 to-success/5"
          : "bg-muted/20"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex flex-col items-center justify-center w-14 h-14 rounded-xl font-bold transition-all duration-300",
            isGoalMet 
              ? "bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-lg shadow-success/30"
              : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
          )}>
            <span className="text-xs uppercase tracking-wide opacity-80">{dayName}</span>
            <span className="text-xl leading-none font-black">{day}</span>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">
              {day.toString().padStart(2, '0')}/{month.toString().padStart(2, '0')}
            </p>
            <p className="text-sm text-muted-foreground">
              {sales.length} {sales.length === 1 ? 'venda' : 'vendas'}
            </p>
          </div>
        </div>
        
        <div>
          {isGoalMet ? (
            <div className="badge-success animate-scale-in">
              <Flag className="w-4 h-4" />
              Meta Batida
            </div>
          ) : (
            <div className="badge-progress">
              <TrendingDown className="w-4 h-4" />
              Falta {formatCurrency(remaining)}
            </div>
          )}
        </div>
      </div>
      
      {/* Sales List */}
      <div className="p-5 space-y-3">
        {sales.map((sale, index) => (
          <div 
            key={sale.id} 
            onClick={() => onSaleClick?.(sale)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer group",
              sale.recognized 
                ? "bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-primary/20" 
                : "bg-destructive/5 border border-destructive/20 hover:bg-destructive/10"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <Package className={cn(
                  "w-4 h-4 flex-shrink-0",
                  sale.recognized ? "text-primary" : "text-destructive"
                )} />
                <span className="text-sm font-bold text-foreground truncate">{sale.product}</span>
                <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{sale.client}</span>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300",
              sale.recognized 
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20" 
                : "bg-destructive/10 text-destructive"
            )}>
              {sale.recognized ? formatCurrency(sale.commission) : 'N/R'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with Total */}
      <div className={cn(
        "px-5 py-4 flex items-center justify-between border-t",
        isGoalMet 
          ? "border-success/20 bg-gradient-to-r from-success/5 to-transparent"
          : "border-border/30 bg-muted/10"
      )}>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Meta: {formatCurrency(dailyGoal)}
          </span>
        </div>
        <div className={cn(
          "text-2xl font-black flex items-center gap-2",
          isGoalMet ? "text-success" : "text-primary"
        )}>
          <Zap className={cn(
            "w-5 h-5",
            isGoalMet ? "text-success" : "text-primary"
          )} />
          {formatCurrency(totalCommission)}
        </div>
      </div>
    </div>
  );
}
