import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Package, Zap } from 'lucide-react';

interface CommissionPromptDialogProps {
  open: boolean;
  productName: string;
  onSelect: (commission: 5 | 15) => void;
  onCancel: () => void;
}

export function CommissionPromptDialog({
  open,
  productName,
  onSelect,
  onCancel,
}: CommissionPromptDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md rounded-2xl bg-card border-border/50 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-2.5 rounded-xl bg-primary/15 shadow-lg shadow-primary/20">
              <Package className="w-5 h-5 text-primary" />
            </div>
            Produto não reconhecido
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-2 text-muted-foreground">
            O produto <strong className="text-foreground">"{productName}"</strong> não foi 
            reconhecido automaticamente. Por favor, selecione o tipo de comissão:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 border-2 border-border/50 rounded-xl bg-muted/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
            onClick={() => onSelect(5)}
          >
            <span className="text-2xl font-black text-primary group-hover:scale-110 transition-transform duration-300">R$ 5,00</span>
            <span className="text-xs font-medium text-muted-foreground">Acessórios (cases, cabos, películas...)</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 border-2 border-border/50 rounded-xl bg-muted/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
            onClick={() => onSelect(15)}
          >
            <span className="text-2xl font-black text-primary group-hover:scale-110 transition-transform duration-300">R$ 15,00</span>
            <span className="text-xs font-medium text-muted-foreground">Aparelhos e Perfumes (celulares, tablets...)</span>
          </Button>

          <Button
            variant="ghost"
            className="mt-2 text-muted-foreground font-bold uppercase tracking-widest hover:text-foreground hover:bg-muted/30 transition-all duration-300"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}