import { useState } from 'react';
import { Plus, Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SaleFormProps {
  onSubmit: (product: string, client: string) => void;
}

export function SaleForm({ onSubmit }: SaleFormProps) {
  const [product, setProduct] = useState('');
  const [client, setClient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.trim() || !client.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    onSubmit(product, client);
    setProduct('');
    setClient('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm font-medium text-foreground">
          Produto
        </Label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="product"
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: iPhone 15, Case silicone..."
            className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client" className="text-sm font-medium text-foreground">
          Cliente
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Nome do cliente"
            className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 gradient-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar Venda
      </Button>
    </form>
  );
}
