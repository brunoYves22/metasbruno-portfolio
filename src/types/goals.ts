export interface DailyGoalAchieved {
  id: string;
  date: string;
  total_commission: number;
  status: string;
  created_at: string;
}

export interface MonthlyGoalAchieved {
  id: string;
  month: number;
  year: number;
  total_commission: number;
  status: string;
  created_at: string;
}
