import { useState, useEffect, useCallback } from 'react';
import { Sale } from '@/types/sale';
import { calculateCommission, isToday } from '@/utils/commission';
import { supabase } from '@/integrations/supabase/client';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sales from database on mount
  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading sales:', error);
      } else if (data) {
        const formattedSales: Sale[] = data.map(sale => ({
          id: sale.id,
          date: sale.date,
          product: sale.product,
          client: sale.client,
          commission: Number(sale.commission),
          recognized: sale.recognized
        }));
        setSales(formattedSales);
      }
      setIsLoaded(true);
    };

    fetchSales();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newSale: Sale = {
              id: payload.new.id,
              date: payload.new.date,
              product: payload.new.product,
              client: payload.new.client,
              commission: Number(payload.new.commission),
              recognized: payload.new.recognized
            };
            setSales(prev => {
              // Avoid duplicates
              if (prev.some(s => s.id === newSale.id)) return prev;
              return [newSale, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedSale: Sale = {
              id: payload.new.id,
              date: payload.new.date,
              product: payload.new.product,
              client: payload.new.client,
              commission: Number(payload.new.commission),
              recognized: payload.new.recognized
            };
            setSales(prev => prev.map(sale => 
              sale.id === updatedSale.id ? updatedSale : sale
            ));
          } else if (payload.eventType === 'DELETE') {
            setSales(prev => prev.filter(sale => sale.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addSale = useCallback(async (product: string, client: string) => {
    const commissionResult = calculateCommission(product);
    
    const newSale = {
      date: new Date().toISOString(),
      product: product.trim(),
      client: client.trim(),
      commission: commissionResult.value,
      recognized: commissionResult.recognized
    };

    const { data, error } = await supabase
      .from('sales')
      .insert(newSale)
      .select()
      .single();

    if (error) {
      console.error('Error adding sale:', error);
      return null;
    }

    return data ? {
      id: data.id,
      date: data.date,
      product: data.product,
      client: data.client,
      commission: Number(data.commission),
      recognized: data.recognized
    } as Sale : null;
  }, []);

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>) => {
    const { error } = await supabase
      .from('sales')
      .update({
        product: updates.product,
        client: updates.client,
        commission: updates.commission,
        date: updates.date,
        recognized: updates.recognized
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }, []);

  const getTodaySales = useCallback(() => {
    return sales.filter(sale => isToday(sale.date));
  }, [sales]);

  const getTodayTotal = useCallback(() => {
    return getTodaySales()
      .filter(sale => sale.recognized)
      .reduce((sum, sale) => sum + sale.commission, 0);
  }, [getTodaySales]);

  const getMonthSales = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
  }, [sales]);

  const getMonthTotal = useCallback(() => {
    return getMonthSales()
      .filter(sale => sale.recognized)
      .reduce((sum, sale) => sum + sale.commission, 0);
  }, [getMonthSales]);

  const deleteSale = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  }, []);

  return {
    sales,
    addSale,
    updateSale,
    deleteSale,
    getTodaySales,
    getTodayTotal,
    getMonthSales,
    getMonthTotal,
    isLoaded
  };
}
