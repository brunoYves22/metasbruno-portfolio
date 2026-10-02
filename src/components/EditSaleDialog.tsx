import { useState } from 'react';
import { X, Save, Trash2, Calendar, Package, User, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sale } from '@/types/sale';
import { formatCurrency } from '@/utils/commission';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EditSaleDialogProps {
  sale: Sale | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Sale>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const COMMISSION_OPTIONS = [5, 10, 15];

export function EditSaleDialog({ sale, open, onOpenChange, onSave, onDelete }: EditSaleDialogProps) {
  const [product, setProduct] = useState('');
  const [client, setClient] = useState('');
  const [commission, setCommission] = useState(0);
  const [date, setDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset form when sale changes
  useState(() => {
    if (sale) {
      setProduct(sale.product);
      setClient(sale.client);
      setCommission(sale.commission);
      setDate(sale.date.split('T')[0]);
    }
  });

  // Update form when dialog opens with new sale
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && sale) {
      setProduct(sale.product);
      setClient(sale.client);
      setCommission(sale.commission);
      setDate(sale.date.split('T')[0]);
    }
    onOpenChange(newOpen);
  };

  const handleSave = async () => {
    if (!sale) return;
    
    if (!product.trim() || !client.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o produto e o cliente",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(sale.id, {
        product: product.trim(),
        client: client.trim(),
        commission,
        date: new Date(date).toISOString(),
        recognized: commission > 0
      });
      
      toast({
        title: "Alterações salvas",
        description: "A venda foi atualizada com sucesso",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a venda",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sale) return;
    
    try {
      await onDelete(sale.id);
      
      toast({
        title: "Venda excluída",
        description: "A venda foi removida com sucesso",
      });
      
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a venda",
        variant: "destructive"
      });
    }
  };

  if (!sale) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="cockpit-card border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15">
                <Package className="w-5 h-5 text-primary" />
              </div>
              Editar Venda
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Altere os dados da venda abaixo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Product */}
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produto
              </Label>
              <Input
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="input-premium"
                placeholder="Nome do produto"
              />
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Cliente
              </Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="input-premium"
                placeholder="Nome do cliente"
              />
            </div>

            {/* Commission */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Comissão
              </Label>
              <div className="flex gap-2">
                {COMMISSION_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCommission(value)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                      commission === value
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Comissão atual: <span className="font-bold text-primary">{formatCurrency(commission)}</span>
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data da Venda
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-premium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="cockpit-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/15">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir Venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
