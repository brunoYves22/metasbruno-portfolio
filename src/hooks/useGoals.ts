import { useState, useEffect, useCallback } from 'react';
import { DailyGoalAchieved, MonthlyGoalAchieved } from '@/types/goals';
import { supabase } from '@/integrations/supabase/client';

export const DAILY_GOAL = 20;
export const MONTHLY_GOAL = 500;

export function useGoals() {
  const [dailyGoalsAchieved, setDailyGoalsAchieved] = useState<DailyGoalAchieved[]>([]);
  const [monthlyGoalsAchieved, setMonthlyGoalsAchieved] = useState<MonthlyGoalAchieved[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load goals from database on mount
  useEffect(() => {
    const fetchGoals = async () => {
      const [dailyResult, monthlyResult] = await Promise.all([
        supabase
          .from('daily_goals_achieved')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('monthly_goals_achieved')
          .select('*')
          .order('year', { ascending: false })
          .order('month', { ascending: false })
      ]);

      if (dailyResult.data) {
        setDailyGoalsAchieved(dailyResult.data.map(g => ({
          ...g,
          total_commission: Number(g.total_commission)
        })));
      }

      if (monthlyResult.data) {
        setMonthlyGoalsAchieved(monthlyResult.data.map(g => ({
          ...g,
          total_commission: Number(g.total_commission)
        })));
      }

      setIsLoaded(true);
    };

    fetchGoals();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const dailyChannel = supabase
      .channel('daily-goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_goals_achieved'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newGoal: DailyGoalAchieved = {
              id: payload.new.id,
              date: payload.new.date,
              total_commission: Number(payload.new.total_commission),
              status: payload.new.status,
              created_at: payload.new.created_at
            };
            setDailyGoalsAchieved(prev => {
              if (prev.some(g => g.id === newGoal.id)) return prev;
              return [newGoal, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setDailyGoalsAchieved(prev => prev.map(g => 
              g.id === payload.new.id 
                ? { ...g, total_commission: Number(payload.new.total_commission) }
                : g
            ));
          }
        }
      )
      .subscribe();

    const monthlyChannel = supabase
      .channel('monthly-goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_goals_achieved'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newGoal: MonthlyGoalAchieved = {
              id: payload.new.id,
              month: payload.new.month,
              year: payload.new.year,
              total_commission: Number(payload.new.total_commission),
              status: payload.new.status,
              created_at: payload.new.created_at
            };
            setMonthlyGoalsAchieved(prev => {
              if (prev.some(g => g.id === newGoal.id)) return prev;
              return [newGoal, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setMonthlyGoalsAchieved(prev => prev.map(g => 
              g.id === payload.new.id 
                ? { ...g, total_commission: Number(payload.new.total_commission) }
                : g
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dailyChannel);
      supabase.removeChannel(monthlyChannel);
    };
  }, []);

  const checkAndRecordDailyGoal = useCallback(async (date: string, totalCommission: number) => {
    if (totalCommission < DAILY_GOAL) return;

    const dateOnly = new Date(date).toISOString().split('T')[0];
    
    // Check if already recorded
    const { data: existing } = await supabase
      .from('daily_goals_achieved')
      .select('id, total_commission')
      .eq('date', dateOnly)
      .maybeSingle();

    if (existing) {
      // Update if commission increased
      if (totalCommission > Number(existing.total_commission)) {
        await supabase
          .from('daily_goals_achieved')
          .update({ total_commission: totalCommission })
          .eq('id', existing.id);
      }
    } else {
      // Insert new record
      await supabase
        .from('daily_goals_achieved')
        .insert({
          date: dateOnly,
          total_commission: totalCommission,
          status: 'Meta Diária Batida'
        });
    }
  }, []);

  const checkAndRecordMonthlyGoal = useCallback(async (month: number, year: number, totalCommission: number) => {
    if (totalCommission < MONTHLY_GOAL) return;

    // Check if already recorded
    const { data: existing } = await supabase
      .from('monthly_goals_achieved')
      .select('id, total_commission')
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    if (existing) {
      // Update if commission increased
      if (totalCommission > Number(existing.total_commission)) {
        await supabase
          .from('monthly_goals_achieved')
          .update({ total_commission: totalCommission })
          .eq('id', existing.id);
      }
    } else {
      // Insert new record
      await supabase
        .from('monthly_goals_achieved')
        .insert({
          month,
          year,
          total_commission: totalCommission,
          status: 'Meta Mensal Batida'
        });
    }
  }, []);

  return {
    dailyGoalsAchieved,
    monthlyGoalsAchieved,
    checkAndRecordDailyGoal,
    checkAndRecordMonthlyGoal,
    isLoaded,
    dailyGoalValue: DAILY_GOAL,
    monthlyGoalValue: MONTHLY_GOAL
  };
}
