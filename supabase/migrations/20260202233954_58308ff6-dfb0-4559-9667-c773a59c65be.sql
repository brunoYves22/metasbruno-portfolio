-- Create table for monthly closures/summaries
CREATE TABLE public.monthly_closures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, year)
);

-- Enable RLS
ALTER TABLE public.monthly_closures ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view monthly closures"
ON public.monthly_closures
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert monthly closures"
ON public.monthly_closures
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update monthly closures"
ON public.monthly_closures
FOR UPDATE
USING (true);