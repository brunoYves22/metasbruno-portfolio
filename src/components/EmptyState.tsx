import { ShoppingBag, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="cockpit-card flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Search className="w-10 h-10 text-primary/50" />
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-primary/5 blur-xl -z-10"></div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground font-medium max-w-sm">{description}</p>
    </div>
  );
}