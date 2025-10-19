-- Fix foreign key constraint to allow investment deletion
-- This will preserve audit logs even when investments are deleted

ALTER TABLE public.audit_logs 
DROP CONSTRAINT IF EXISTS audit_logs_investment_id_fkey;

ALTER TABLE public.audit_logs 
ADD CONSTRAINT audit_logs_investment_id_fkey 
FOREIGN KEY (investment_id) 
REFERENCES public.investments(id) 
ON DELETE SET NULL;