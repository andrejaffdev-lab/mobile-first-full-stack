-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admin full access clientes" ON public.clientes;
DROP POLICY IF EXISTS "Cliente own access" ON public.clientes;
DROP POLICY IF EXISTS "Cliente own update" ON public.clientes;
DROP POLICY IF EXISTS "Public insert clientes" ON public.clientes;

-- Recreate policies as PERMISSIVE (default)
CREATE POLICY "Admin full access clientes" 
ON public.clientes 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cliente own access" 
ON public.clientes 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Cliente own update" 
ON public.clientes 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public insert clientes" 
ON public.clientes 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also fix prestadores_servico policies
DROP POLICY IF EXISTS "Admin full access prestadores" ON public.prestadores_servico;
DROP POLICY IF EXISTS "Prestador own access" ON public.prestadores_servico;
DROP POLICY IF EXISTS "Prestador own update" ON public.prestadores_servico;
DROP POLICY IF EXISTS "Public insert prestadores" ON public.prestadores_servico;

CREATE POLICY "Admin full access prestadores" 
ON public.prestadores_servico 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Prestador own access" 
ON public.prestadores_servico 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Prestador own update" 
ON public.prestadores_servico 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public insert prestadores" 
ON public.prestadores_servico 
FOR INSERT 
TO authenticated
WITH CHECK (true);