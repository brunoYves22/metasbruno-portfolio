import { LayoutDashboard, History, Target, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'dashboard' | 'history' | 'goals';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Gauge },
    { id: 'history' as const, label: 'Vendas', icon: History },
    { id: 'goals' as const, label: 'Metas', icon: Target },
  ];

  return (
    <nav className="nav-premium">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'nav-premium-item group',
              isActive && 'active'
            )}
          >
            <Icon className={cn(
              "w-5 h-5 transition-transform duration-300",
              isActive && "scale-110"
            )} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}