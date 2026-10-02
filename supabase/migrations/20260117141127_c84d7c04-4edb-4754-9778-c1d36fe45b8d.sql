-- Create table for daily goals achieved
CREATE TABLE public.daily_goals_achieved (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Meta Diária Batida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for monthly goals achieved
CREATE TABLE public.monthly_goals_achieved (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Meta Mensal Batida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, year)
);

-- Enable RLS on daily_goals_achieved
ALTER TABLE public.daily_goals_achieved ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_goals_achieved
CREATE POLICY "Anyone can view daily goals" 
ON public.daily_goals_achieved 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert daily goals" 
ON public.daily_goals_achieved 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update daily goals" 
ON public.daily_goals_achieved 
FOR UPDATE 
USING (true);

-- Enable RLS on monthly_goals_achieved
ALTER TABLE public.monthly_goals_achieved ENABLE ROW LEVEL SECURITY;

-- Create policies for monthly_goals_achieved
CREATE POLICY "Anyone can view monthly goals" 
ON public.monthly_goals_achieved 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert monthly goals" 
ON public.monthly_goals_achieved 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update monthly goals" 
ON public.monthly_goals_achieved 
FOR UPDATE 
USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_goals_achieved;
ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_goals_achieved;