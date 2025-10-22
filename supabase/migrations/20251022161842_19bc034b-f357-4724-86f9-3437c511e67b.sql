-- Add admin-editable fields to profiles table for user-facing values
ALTER TABLE public.profiles
ADD COLUMN withdrawal_principle_usd numeric DEFAULT 0,
ADD COLUMN jpy_deposit numeric DEFAULT 0,
ADD COLUMN total_returns numeric DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.withdrawal_principle_usd IS 'Admin-editable USD withdrawal principle shown to user';
COMMENT ON COLUMN public.profiles.jpy_deposit IS 'Admin-editable JPY deposit amount shown to user';
COMMENT ON COLUMN public.profiles.total_returns IS 'Admin-editable total returns shown to user';