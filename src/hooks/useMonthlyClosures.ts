import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MonthlyClosure {
  id: string;
  month: number;
  year: number;
  total_commission: number;
  total_sales: number;
  created_at: string;
}

export function useMonthlyClosures() {
  const [closures, setClosures] = useState<MonthlyClosure[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load closures from database
  useEffect(() => {
    const fetchClosures = async () => {
      const { data, error } = await supabase
        .from('monthly_closures')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) {
        console.error('Error loading monthly closures:', error);
      } else if (data) {
        const formattedClosures: MonthlyClosure[] = data.map(closure => ({
          id: closure.id,
          month: closure.month,
          year: closure.year,
          total_commission: Number(closure.total_commission),
          total_sales: closure.total_sales,
          created_at: closure.created_at
        }));
        setClosures(formattedClosures);
      }
      setIsLoaded(true);
    };

    fetchClosures();
  }, []);

  // Check and create closure for a specific month if it doesn't exist
  const checkAndCreateClosure = useCallback(async (
    month: number, 
    year: number, 
    totalCommission: number, 
    totalSales: number
  ) => {
    // Check if closure already exists
    const existing = closures.find(c => c.month === month && c.year === year);
    if (existing) {
      // Update if values changed
      if (existing.total_commission !== totalCommission || existing.total_sales !== totalSales) {
        const { error } = await supabase
          .from('monthly_closures')
          .update({ 
            total_commission: totalCommission, 
            total_sales: totalSales 
          })
          .eq('id', existing.id);

        if (!error) {
          setClosures(prev => prev.map(c => 
            c.id === existing.id 
              ? { ...c, total_commission: totalCommission, total_sales: totalSales }
              : c
          ));
        }
      }
      return;
    }

    // Create new closure
    const { data, error } = await supabase
      .from('monthly_closures')
      .insert({
        month,
        year,
        total_commission: totalCommission,
        total_sales: totalSales
      })
      .select()
      .single();

    if (error) {
      // Ignore unique constraint violation (closure already exists)
      if (!error.message.includes('unique constraint')) {
        console.error('Error creating monthly closure:', error);
      }
    } else if (data) {
      setClosures(prev => [{
        id: data.id,
        month: data.month,
        year: data.year,
        total_commission: Number(data.total_commission),
        total_sales: data.total_sales,
        created_at: data.created_at
      }, ...prev]);
    }
  }, [closures]);

  // Get closure for a specific month
  const getClosureForMonth = useCallback((month: number, year: number) => {
    return closures.find(c => c.month === month && c.year === year);
  }, [closures]);

  return {
    closures,
    isLoaded,
    checkAndCreateClosure,
    getClosureForMonth
  };
}
