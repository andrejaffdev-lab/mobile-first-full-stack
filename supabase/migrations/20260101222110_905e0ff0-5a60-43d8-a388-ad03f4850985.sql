-- Allow bootstrapping the very first admin user safely

CREATE OR REPLACE FUNCTION public.no_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'::public.app_role
  );
$$;

-- Ensure admin full access policy also works for INSERT/UPDATE (WITH CHECK)
DROP POLICY IF EXISTS "Admin full access" ON public.user_roles;
CREATE POLICY "Admin full access"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Users can view their own roles (keep if exists)
-- (No change)

-- Allow the first ever admin to self-assign admin role once
DROP POLICY IF EXISTS "Bootstrap first admin" ON public.user_roles;
CREATE POLICY "Bootstrap first admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'admin'::public.app_role
  AND public.no_admin_exists()
);
