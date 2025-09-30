-- Add DELETE policy for investments table
CREATE POLICY "Users can delete their own investments"
ON public.investments
FOR DELETE
USING (auth.uid() = user_id);