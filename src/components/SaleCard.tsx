import { Clock, Package, User, AlertCircle, Zap, Edit3 } from 'lucide-react';
import { Sale } from '@/types/sale';
import { formatCurrency, formatDate } from '@/utils/commission';
import { cn } from '@/lib/utils';

interface SaleCardProps {
  sale: Sale;
  onClick?: () => void;
}

export function SaleCard({ sale, onClick }: SaleCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        'premium-card p-5 transition-all duration-300 hover-lift group cursor-pointer',
        sale.recognized 
          ? 'hover:border-primary/50' 
          : 'border-destructive/40 bg-destructive/5'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-300",
              sale.recognized 
                ? "bg-primary/15 group-hover:bg-primary/25 group-hover:shadow-lg group-hover:shadow-primary/20" 
                : "bg-destructive/10"
            )}>
              <Package className={cn(
                "w-4 h-4",
                sale.recognized ? "text-primary" : "text-destructive"
              )} />
            </div>
            <span className="font-bold text-foreground truncate">{sale.product}</span>
            <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate">{sale.client}</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDate(sale.date)}</span>
            </div>
          </div>
        </div>
        
        <div className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
          sale.recognized 
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 group-hover:shadow-primary/50' 
            : 'bg-destructive/10 text-destructive border border-destructive/30'
        )}>
          {sale.recognized ? (
            <>
              <Zap className="w-4 h-4" />
              {formatCurrency(sale.commission)}
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              N/R
            </>
          )}
        </div>
      </div>
    </div>
  );
}
