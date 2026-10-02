import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
}

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  };

  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  return (
    <div className="cockpit-card flex items-center justify-between p-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousMonth}
        className="h-11 w-11 text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/15">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg text-foreground">
          {MONTH_NAMES[selectedMonth]} {selectedYear}
        </span>
        {isCurrentMonth && (
          <span className="text-xs bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-lg shadow-primary/30">
            Atual
          </span>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className={cn(
          "h-11 w-11 rounded-xl transition-all duration-300",
          isCurrentMonth 
            ? "text-muted-foreground/30 cursor-not-allowed" 
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        )}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}