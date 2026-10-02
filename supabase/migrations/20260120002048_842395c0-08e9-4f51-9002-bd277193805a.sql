-- Create table to store learned product classifications
CREATE TABLE public.learned_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL UNIQUE,
  commission_value INTEGER NOT NULL CHECK (commission_value IN (5, 15)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.learned_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this app)
CREATE POLICY "Anyone can view learned products" 
ON public.learned_products 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert learned products" 
ON public.learned_products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update learned products" 
ON public.learned_products 
FOR UPDATE 
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.learned_products;