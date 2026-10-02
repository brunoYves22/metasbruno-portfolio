import { useState } from 'react';
import { Plus, Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CommissionPromptDialog } from './CommissionPromptDialog';
import { calculateCommissionWithLearned } from '@/utils/commission';
import { useLearnedProducts } from '@/hooks/useLearnedProducts';
import { supabase } from '@/integrations/supabase/client';

interface SaleFormWithLearningProps {
  onSaleAdded: () => void;
}

export function SaleFormWithLearning({ onSaleAdded }: SaleFormWithLearningProps) {
  const [product, setProduct] = useState('');
  const [client, setClient] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingSale, setPendingSale] = useState<{ product: string; client: string } | null>(null);
  
  const { findLearnedCommission, saveLearnedProduct } = useLearnedProducts();

  const saveSale = async (productName: string, clientName: string, commission: number) => {
    const newSale = {
      date: new Date().toISOString(),
      product: productName.trim(),
      client: clientName.trim(),
      commission: commission,
      recognized: true
    };

    const { error } = await supabase
      .from('sales')
      .insert(newSale);

    if (error) {
      console.error('Error adding sale:', error);
      toast.error('Erro ao adicionar venda');
      return false;
    }

    toast.success(`Venda adicionada! Comissão: R$ ${commission},00`);
    onSaleAdded();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.trim() || !client.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    const learnedCommission = findLearnedCommission(product);
    const result = calculateCommissionWithLearned(product, learnedCommission);

    if (result.needsUserInput) {
      setPendingSale({ product: product.trim(), client: client.trim() });
      setShowPrompt(true);
    } else {
      const success = await saveSale(product, client, result.value);
      if (success) {
        setProduct('');
        setClient('');
      }
    }
  };

  const handleCommissionSelect = async (commission: 5 | 15) => {
    if (!pendingSale) return;

    await saveLearnedProduct(pendingSale.product, commission);
    const success = await saveSale(pendingSale.product, pendingSale.client, commission);
    
    if (success) {
      setProduct('');
      setClient('');
    }
    
    setShowPrompt(false);
    setPendingSale(null);
  };

  const handleCancel = () => {
    setShowPrompt(false);
    setPendingSale(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm font-bold uppercase tracking-wide text-foreground">
            Produto
          </Label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              id="product"
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex: iPhone 15, Case silicone..."
              className="input-premium pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client" className="text-sm font-bold uppercase tracking-wide text-foreground">
            Cliente
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="client"
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nome do cliente"
              className="input-premium pl-12"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="btn-premium w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Venda
        </Button>
      </form>

      <CommissionPromptDialog
        open={showPrompt}
        productName={pendingSale?.product || ''}
        onSelect={handleCommissionSelect}
        onCancel={handleCancel}
      />
    </>
  );
}
