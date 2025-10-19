-- Ensure profiles.user_id is unique (it should be, but let's make it explicit)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Drop and recreate the foreign key to ensure it references the correct column
ALTER TABLE public.investments DROP CONSTRAINT IF EXISTS investments_user_id_fkey;

ALTER TABLE public.investments
ADD CONSTRAINT investments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(user_id)
ON DELETE CASCADE;