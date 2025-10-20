-- Create withdrawal preferences table
CREATE TABLE public.withdrawal_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  withdrawal_type TEXT NOT NULL CHECK (withdrawal_type IN ('returns', 'principles')),
  frequency TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, withdrawal_type)
);

-- Enable RLS
ALTER TABLE public.withdrawal_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view their own withdrawal preferences"
ON public.withdrawal_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert their own withdrawal preferences"
ON public.withdrawal_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update their own withdrawal preferences"
ON public.withdrawal_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete their own withdrawal preferences"
ON public.withdrawal_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all preferences
CREATE POLICY "Admins can view all withdrawal preferences"
ON public.withdrawal_preferences
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all preferences
CREATE POLICY "Admins can update all withdrawal preferences"
ON public.withdrawal_preferences
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_withdrawal_preferences_updated_at
BEFORE UPDATE ON public.withdrawal_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();