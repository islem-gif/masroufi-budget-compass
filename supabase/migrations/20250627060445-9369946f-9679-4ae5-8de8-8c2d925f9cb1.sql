
-- Ajouter une contrainte unique sur l'email si elle n'existe pas déjà
ALTER TABLE public.users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Créer un utilisateur administrateur par défaut
-- Vous devrez remplacer 'admin@masroufi.com' par l'email que vous voulez utiliser
INSERT INTO public.users (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  dark_mode, 
  language, 
  currency,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@masroufi.com',
  'Admin',
  'Masroufi',
  'admin',
  false,
  'fr',
  'TND',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Créer une fonction pour promouvoir un utilisateur au rôle admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Vérifier si l'utilisateur existe
  SELECT COUNT(*) INTO user_count
  FROM public.users
  WHERE email = user_email;
  
  IF user_count = 0 THEN
    RETURN 'Utilisateur non trouvé avec cet email: ' || user_email;
  END IF;
  
  -- Promouvoir l'utilisateur au rôle admin
  UPDATE public.users
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  RETURN 'Utilisateur ' || user_email || ' promu au rôle administrateur avec succès.';
END;
$$;

-- Créer une fonction pour rétrograder un admin en utilisateur normal
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
  admin_count INTEGER;
BEGIN
  -- Vérifier combien d'admins il y a
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE role = 'admin';
  
  IF admin_count <= 1 THEN
    RETURN 'Impossible de rétrograder le dernier administrateur.';
  END IF;
  
  -- Vérifier si l'utilisateur existe et est admin
  SELECT COUNT(*) INTO user_count
  FROM public.users
  WHERE email = user_email AND role = 'admin';
  
  IF user_count = 0 THEN
    RETURN 'Aucun administrateur trouvé avec cet email: ' || user_email;
  END IF;
  
  -- Rétrograder l'admin en utilisateur normal
  UPDATE public.users
  SET role = 'user', updated_at = now()
  WHERE email = user_email;
  
  RETURN 'Administrateur ' || user_email || ' rétrogradé en utilisateur normal.';
END;
$$;
