-- Rename the column from withdrawal_principle_usd to withdrawal_principal_usd
ALTER TABLE public.profiles 
RENAME COLUMN withdrawal_principle_usd TO withdrawal_principal_usd;