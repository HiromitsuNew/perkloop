-- Create app_role enum (if not exists)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamp with time zone DEFAULT now(),
  admin_user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  investment_id uuid REFERENCES investments(id),
  details jsonb,
  ip_address text
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can update all investments" ON public.investments;

-- RLS Policy: Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policy: Only admins can insert audit logs
CREATE POLICY "Only admins can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update RLS Policy: Only admins can update investment status
CREATE POLICY "Admins can update all investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add columns to investments table (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'reference_code') THEN
    ALTER TABLE public.investments ADD COLUMN reference_code text UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'jpy_received_at') THEN
    ALTER TABLE public.investments ADD COLUMN jpy_received_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'jpy_amount') THEN
    ALTER TABLE public.investments ADD COLUMN jpy_amount numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'usdc_converted_at') THEN
    ALTER TABLE public.investments ADD COLUMN usdc_converted_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'usdc_amount') THEN
    ALTER TABLE public.investments ADD COLUMN usdc_amount numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'navi_deployed_at') THEN
    ALTER TABLE public.investments ADD COLUMN navi_deployed_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'navi_transaction_hash') THEN
    ALTER TABLE public.investments ADD COLUMN navi_transaction_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'expected_return_date') THEN
    ALTER TABLE public.investments ADD COLUMN expected_return_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'payout_jpy_amount') THEN
    ALTER TABLE public.investments ADD COLUMN payout_jpy_amount numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'payout_processed_at') THEN
    ALTER TABLE public.investments ADD COLUMN payout_processed_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'payout_transaction_id') THEN
    ALTER TABLE public.investments ADD COLUMN payout_transaction_id text;
  END IF;
END $$;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action_type text,
  p_investment_id uuid,
  p_details jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (admin_user_id, action_type, investment_id, details)
  VALUES (auth.uid(), p_action_type, p_investment_id, p_details);
END;
$$;

-- Add bank details columns to profiles (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bank_name') THEN
    ALTER TABLE public.profiles ADD COLUMN bank_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bank_branch') THEN
    ALTER TABLE public.profiles ADD COLUMN bank_branch text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_type') THEN
    ALTER TABLE public.profiles ADD COLUMN account_type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_number') THEN
    ALTER TABLE public.profiles ADD COLUMN account_number text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_holder_name') THEN
    ALTER TABLE public.profiles ADD COLUMN account_holder_name text;
  END IF;
END $$;