-- Add returns column to investments table
ALTER TABLE public.investments 
ADD COLUMN returns numeric DEFAULT 0 NOT NULL;

-- Change default status to 'pending' for new investments
ALTER TABLE public.investments 
ALTER COLUMN status SET DEFAULT 'pending'::text;

-- Add index for better query performance
CREATE INDEX idx_investments_status ON public.investments(status);

-- Add comment for clarity
COMMENT ON COLUMN public.investments.returns IS 'Total returns earned on this investment in dollars';