import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Zap, Trophy } from 'lucide-react';
import yvexLogo from '@/assets/yvex-logo.png';
import { Navigation, TabId } from '@/components/Navigation';
import { StatCard } from '@/components/StatCard';
import { GoalStatus } from '@/components/GoalStatus';
import { SaleFormWithLearning } from '@/components/SaleFormWithLearning';
import { SaleCard } from '@/components/SaleCard';
import { EmptyState } from '@/components/EmptyState';
import { GoalsPage } from '@/components/GoalsPage';
import { SalesHistoryTab } from '@/components/SalesHistoryTab';
import { EditSaleDialog } from '@/components/EditSaleDialog';
import { useSales } from '@/hooks/useSales';
import { useGoals, DAILY_GOAL, MONTHLY_GOAL } from '@/hooks/useGoals';
import { formatCurrency } from '@/utils/commission';
import { Sale } from '@/types/sale';
import { TopLight } from '@/components/ui/top-light';
import { GlowingLogoFrame } from '@/components/ui/glowing-logo-frame';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { sales, addSale, updateSale, deleteSale, getTodaySales, getTodayTotal, getMonthTotal, isLoaded } = useSales();
  const { 
    dailyGoalsAchieved, 
    monthlyGoalsAchieved, 
    checkAndRecordDailyGoal, 
    checkAndRecordMonthlyGoal,
    isLoaded: goalsLoaded,
    dailyGoalValue,
    monthlyGoalValue
  } = useGoals();
  
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const todaySales = getTodaySales();
  const todayTotal = getTodayTotal();
  const monthTotal = getMonthTotal();

  // Check and record goals when totals change
  useEffect(() => {
    if (isLoaded && todayTotal >= DAILY_GOAL) {
      const today = new Date().toISOString();
      checkAndRecordDailyGoal(today, todayTotal);
    }
  }, [todayTotal, isLoaded, checkAndRecordDailyGoal]);

  useEffect(() => {
    if (isLoaded && monthTotal >= MONTHLY_GOAL) {
      const now = new Date();
      checkAndRecordMonthlyGoal(now.getMonth() + 1, now.getFullYear(), monthTotal);
    }
  }, [monthTotal, isLoaded, checkAndRecordMonthlyGoal]);

  const handleSaleAdded = () => {
    // The real-time subscription will handle the update
  };

  const handleSaleClick = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  if (!isLoaded || !goalsLoaded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <span className="text-muted-foreground font-bold tracking-widest uppercase text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TopLight />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center">
            <GlowingLogoFrame
              src={yvexLogo}
              alt="YVEX - Sistemas Inteligentes. Lojas Mais Eficientes."
            />
          </div>
          <div className="divider-glow mx-auto max-w-xs"></div>
        </header>

        {/* Navigation */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 stagger-children">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Total Hoje"
                value={formatCurrency(todayTotal)}
                icon={<DollarSign className="w-6 h-6" />}
                variant="hero"
                subtitle="comissões do dia"
              />
              <StatCard
                title="Vendas Hoje"
                value={todaySales.length.toString()}
                icon={<ShoppingBag className="w-6 h-6" />}
                variant="cockpit"
                subtitle="registradas"
              />
            </div>

            {/* Goal Status */}
            <GoalStatus currentValue={todayTotal} goalValue={DAILY_GOAL} />

            {/* Sale Form */}
            <div className="cockpit-card p-6">
              <h2 className="text-title text-foreground mb-5 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/15 shadow-lg shadow-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                Registrar Venda
              </h2>
              <SaleFormWithLearning onSaleAdded={handleSaleAdded} />
            </div>

            {/* Today's Sales Preview */}
            {todaySales.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Vendas de Hoje ({todaySales.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {todaySales.slice(0, 3).map((sale, index) => (
                    <div 
                      key={sale.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <SaleCard sale={sale} onClick={() => handleSaleClick(sale)} />
                    </div>
                  ))}
                  {todaySales.length > 3 && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className="w-full py-4 text-sm text-primary font-bold uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all duration-300 border border-primary/20 hover:border-primary/40"
                    >
                      Ver todas as vendas →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <SalesHistoryTab 
            sales={sales} 
            onUpdateSale={updateSale}
            onDeleteSale={deleteSale}
          />
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <GoalsPage
            dailyGoalsAchieved={dailyGoalsAchieved}
            monthlyGoalsAchieved={monthlyGoalsAchieved}
            dailyGoalValue={dailyGoalValue}
            monthlyGoalValue={monthlyGoalValue}
          />
        )}
      </div>

      {/* Edit Sale Dialog for Dashboard */}
      <EditSaleDialog
        sale={editingSale}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={updateSale}
        onDelete={deleteSale}
      />
    </div>
  );
};

export default Index;
