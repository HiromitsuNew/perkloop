-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
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
CREATE TABLE public.audit_logs (
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

-- Add columns to investments table for admin tracking
ALTER TABLE public.investments
ADD COLUMN reference_code text UNIQUE,
ADD COLUMN jpy_received_at timestamp with time zone,
ADD COLUMN jpy_amount numeric,
ADD COLUMN usdc_converted_at timestamp with time zone,
ADD COLUMN usdc_amount numeric,
ADD COLUMN navi_deployed_at timestamp with time zone,
ADD COLUMN navi_transaction_hash text,
ADD COLUMN expected_return_date date,
ADD COLUMN payout_jpy_amount numeric,
ADD COLUMN payout_processed_at timestamp with time zone,
ADD COLUMN payout_transaction_id text;

-- Update RLS Policy: Only admins can update investment status
CREATE POLICY "Admins can update all investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

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

-- Add bank details columns to profiles
ALTER TABLE public.profiles
ADD COLUMN bank_name text,
ADD COLUMN bank_branch text,
ADD COLUMN account_type text,
ADD COLUMN account_number text,
ADD COLUMN account_holder_name text;