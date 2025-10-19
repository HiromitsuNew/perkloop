-- Allow admins to view all investments
CREATE POLICY "Admins can view all investments"
ON public.investments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));