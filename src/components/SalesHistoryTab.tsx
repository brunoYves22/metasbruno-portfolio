import { useMemo, useState, useEffect } from 'react';
import { TrendingUp, Trophy, Target, DollarSign, Calendar, Zap } from 'lucide-react';
import { Sale } from '@/types/sale';
import { MonthSelector } from '@/components/MonthSelector';
import { DailySalesBlock } from '@/components/DailySalesBlock';
import { MonthlyGoalStatus } from '@/components/MonthlyGoalStatus';
import { EmptyState } from '@/components/EmptyState';
import { MonthlyClosuresHistory } from '@/components/MonthlyClosuresHistory';
import { EditSaleDialog } from '@/components/EditSaleDialog';
import { formatCurrency } from '@/utils/commission';
import { DAILY_GOAL, MONTHLY_GOAL } from '@/hooks/useGoals';
import { useMonthlyClosures } from '@/hooks/useMonthlyClosures';

interface SalesHistoryTabProps {
  sales: Sale[];
  onUpdateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  onDeleteSale: (id: string) => Promise<void>;
}

interface GroupedSales {
  [date: string]: Sale[];
}

export function SalesHistoryTab({ sales, onUpdateSale, onDeleteSale }: SalesHistoryTabProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { closures, checkAndCreateClosure } = useMonthlyClosures();
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleSaleClick = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;

  // Filter sales by selected month
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === selectedMonth && saleDate.getFullYear() === selectedYear;
    });
  }, [sales, selectedMonth, selectedYear]);

  // Group sales by date
  const groupedSales = useMemo(() => {
    const groups: GroupedSales = {};
    
    filteredSales.forEach(sale => {
      const dateKey = sale.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(sale);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, sales]) => ({ date, sales }));
  }, [filteredSales]);

  // Calculate month total
  const monthTotal = useMemo(() => {
    return filteredSales
      .filter(sale => sale.recognized)
      .reduce((sum, sale) => sum + sale.commission, 0);
  }, [filteredSales]);

  // Count recognized sales for the selected month
  const monthSalesCount = useMemo(() => {
    return filteredSales.filter(sale => sale.recognized).length;
  }, [filteredSales]);

  // Auto-save monthly closure for past months
  useEffect(() => {
    if (!isCurrentMonth && filteredSales.length > 0) {
      checkAndCreateClosure(
        selectedMonth + 1,
        selectedYear,
        monthTotal,
        monthSalesCount
      );
    }
  }, [selectedMonth, selectedYear, monthTotal, monthSalesCount, isCurrentMonth, checkAndCreateClosure, filteredSales.length]);

  // Count days with goal met
  const daysWithGoalMet = useMemo(() => {
    return groupedSales.filter(({ sales: daySales }) => {
      const dayTotal = daySales
        .filter(sale => sale.recognized)
        .reduce((sum, sale) => sum + sale.commission, 0);
      return dayTotal >= DAILY_GOAL;
    }).length;
  }, [groupedSales]);

  return (
    <div className="space-y-6 stagger-children">
      {/* Month Selector */}
      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      {/* Monthly Goal Widget */}
      <MonthlyGoalStatus currentValue={monthTotal} goalValue={MONTHLY_GOAL} />

      {/* Month Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="cockpit-card p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/15 shadow-lg shadow-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vendas</span>
          </div>
          <p className="text-3xl font-black text-foreground">{filteredSales.length}</p>
        </div>
        <div className="cockpit-card p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-success/20 shadow-lg shadow-success/20">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dias com Meta</span>
          </div>
          <p className="text-3xl font-black text-success">{daysWithGoalMet}</p>
        </div>
      </div>

      {/* Month Commission Widget */}
      <div className="hero-card">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <p className="stat-label">
              Total do Mês {isCurrentMonth ? '(Atual)' : ''}
            </p>
            <p className="stat-value-lg">
              {formatCurrency(monthTotal)}
            </p>
            <p className="text-sm opacity-70 mt-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {monthSalesCount} vendas reconhecidas
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/20">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Monthly Closures History */}
      {!isCurrentMonth && closures.length > 0 && (
        <MonthlyClosuresHistory closures={closures.filter(c => 
          !(c.month === selectedMonth + 1 && c.year === selectedYear)
        ).slice(0, 3)} />
      )}

      {/* Daily Sales Blocks */}
      <div className="space-y-2">
        <h2 className="text-title text-foreground flex items-center justify-between">
          <span className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/15">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            Vendas por Dia
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {groupedSales.length} {groupedSales.length === 1 ? 'dia' : 'dias'}
          </span>
        </h2>
      </div>
      
      {groupedSales.length === 0 ? (
        <EmptyState
          title="Nenhuma venda neste mês"
          description="Selecione outro mês ou registre uma nova venda no Dashboard"
        />
      ) : (
        <div className="space-y-4">
          {groupedSales.map(({ date, sales: daySales }, index) => (
            <div 
              key={date}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DailySalesBlock 
                date={date} 
                sales={daySales}
                dailyGoal={DAILY_GOAL}
                onSaleClick={handleSaleClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Sale Dialog */}
      <EditSaleDialog
        sale={editingSale}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={onUpdateSale}
        onDelete={onDeleteSale}
      />
    </div>
  );
}
