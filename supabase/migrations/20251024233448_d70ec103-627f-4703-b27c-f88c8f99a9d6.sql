-- Fix search_path for existing functions to prevent security vulnerabilities

-- Fix log_activity function
CREATE OR REPLACE FUNCTION public.log_activity(user_id uuid, action text, entity_type text, entity_id uuid DEFAULT NULL::uuid, details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (user_id, action, entity_type, entity_id, details);
END;
$function$;

-- Fix demote_admin_to_user function
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_count INTEGER;
  admin_count INTEGER;
BEGIN
  -- Check how many admins exist
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  IF admin_count <= 1 THEN
    RETURN 'Cannot demote the last administrator.';
  END IF;
  
  -- Check if user exists and is admin
  SELECT COUNT(*) INTO user_count
  FROM public.users u
  INNER JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE u.email = user_email AND ur.role = 'admin';
  
  IF user_count = 0 THEN
    RETURN 'No administrator found with this email: ' || user_email;
  END IF;
  
  -- Get user_id and demote
  DELETE FROM public.user_roles
  WHERE user_id = (SELECT id FROM public.users WHERE email = user_email)
    AND role = 'admin';
    
  INSERT INTO public.user_roles (user_id, role)
  VALUES ((SELECT id FROM public.users WHERE email = user_email), 'user')
  ON CONFLICT DO NOTHING;
  
  RETURN 'Administrator ' || user_email || ' demoted to regular user.';
END;
$function$;

-- Fix handle_new_user_signup function
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.created_at,
    NEW.created_at
  );
  RETURN NEW;
END;
$function$;

-- Fix log_goal_activity function
CREATE OR REPLACE FUNCTION public.log_goal_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'created',
      'financial_goal',
      NEW.id,
      jsonb_build_object('name', NEW.name, 'target_amount', NEW.target_amount)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'updated',
      'financial_goal',
      NEW.id,
      jsonb_build_object('name', NEW.name, 'current_amount', NEW.current_amount, 'target_amount', NEW.target_amount)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_activity(
      OLD.user_id,
      'deleted',
      'financial_goal',
      OLD.id,
      jsonb_build_object('name', OLD.name, 'target_amount', OLD.target_amount)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix log_transaction_activity function
CREATE OR REPLACE FUNCTION public.log_transaction_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'created',
      'transaction',
      NEW.id,
      jsonb_build_object('amount', NEW.amount, 'type', NEW.type, 'description', NEW.description)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_activity(
      OLD.user_id,
      'deleted',
      'transaction',
      OLD.id,
      jsonb_build_object('amount', OLD.amount, 'type', OLD.type, 'description', OLD.description)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix promote_user_to_admin function
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_count INTEGER;
  target_user_id UUID;
BEGIN
  -- Check if user exists
  SELECT COUNT(*), id INTO user_count, target_user_id
  FROM public.users
  WHERE email = user_email
  GROUP BY id;
  
  IF user_count = 0 THEN
    RETURN 'User not found with this email: ' || user_email;
  END IF;
  
  -- Promote user to admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Remove regular user role if exists
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'user';
  
  RETURN 'User ' || user_email || ' promoted to administrator role successfully.';
END;
$function$;