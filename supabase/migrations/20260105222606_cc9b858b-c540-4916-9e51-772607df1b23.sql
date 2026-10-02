-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  product TEXT NOT NULL,
  client TEXT NOT NULL,
  commission NUMERIC(10, 2) NOT NULL DEFAULT 0,
  recognized BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth required for now)
CREATE POLICY "Anyone can view sales" 
ON public.sales 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete sales" 
ON public.sales 
FOR DELETE 
USING (true);

-- Enable realtime for sales table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;