import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LearnedProduct {
  id: string;
  product_name: string;
  commission_value: number;
  created_at: string;
}

export function useLearnedProducts() {
  const [learnedProducts, setLearnedProducts] = useState<LearnedProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load learned products on mount
  useEffect(() => {
    const fetchLearnedProducts = async () => {
      const { data, error } = await supabase
        .from('learned_products')
        .select('*');

      if (error) {
        console.error('Error loading learned products:', error);
      } else if (data) {
        setLearnedProducts(data);
      }
      setIsLoaded(true);
    };

    fetchLearnedProducts();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('learned-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learned_products'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProduct = payload.new as LearnedProduct;
            setLearnedProducts(prev => {
              if (prev.some(p => p.id === newProduct.id)) return prev;
              return [...prev, newProduct];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as LearnedProduct;
            setLearnedProducts(prev => 
              prev.map(p => p.id === updated.id ? updated : p)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const findLearnedCommission = useCallback((productName: string): number | null => {
    const normalized = productName.toLowerCase().trim();
    
    // First try exact match
    const exactMatch = learnedProducts.find(
      p => p.product_name.toLowerCase() === normalized
    );
    if (exactMatch) return exactMatch.commission_value;

    // Then try partial match (product name contains learned name or vice versa)
    const partialMatch = learnedProducts.find(p => {
      const learnedName = p.product_name.toLowerCase();
      return normalized.includes(learnedName) || learnedName.includes(normalized);
    });
    if (partialMatch) return partialMatch.commission_value;

    return null;
  }, [learnedProducts]);

  const saveLearnedProduct = useCallback(async (productName: string, commissionValue: number) => {
    const normalizedName = productName.toLowerCase().trim();
    
    // Check if already exists
    const existing = learnedProducts.find(
      p => p.product_name.toLowerCase() === normalizedName
    );

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('learned_products')
        .update({ commission_value: commissionValue })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating learned product:', error);
        return false;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('learned_products')
        .insert({
          product_name: normalizedName,
          commission_value: commissionValue
        });

      if (error) {
        console.error('Error saving learned product:', error);
        return false;
      }
    }

    return true;
  }, [learnedProducts]);

  return {
    learnedProducts,
    findLearnedCommission,
    saveLearnedProduct,
    isLoaded
  };
}
