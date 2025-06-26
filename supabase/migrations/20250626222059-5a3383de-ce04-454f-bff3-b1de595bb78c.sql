
-- Créer une table pour les rôles d'utilisateurs
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Ajouter une colonne role à la table users
ALTER TABLE public.users ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- Créer une table pour traquer l'activité des utilisateurs
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins puissent voir toutes les activités
CREATE POLICY "Admins can view all activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Politique pour que tous les utilisateurs authentifiés puissent créer des logs
CREATE POLICY "Authenticated users can create activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Créer une fonction pour logger automatiquement les activités
CREATE OR REPLACE FUNCTION public.log_activity(
  user_id UUID,
  action TEXT,
  entity_type TEXT,
  entity_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (user_id, action, entity_type, entity_id, details);
END;
$$;

-- Ajouter des triggers pour logger automatiquement les activités
CREATE OR REPLACE FUNCTION public.log_transaction_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.log_goal_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Créer les triggers
CREATE TRIGGER transaction_activity_trigger
  AFTER INSERT OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_transaction_activity();

CREATE TRIGGER goal_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_goals
  FOR EACH ROW EXECUTE FUNCTION public.log_goal_activity();

-- Activer les mises à jour en temps réel pour toutes les tables
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.financial_goals REPLICA IDENTITY FULL;
ALTER TABLE public.budgets REPLICA IDENTITY FULL;
ALTER TABLE public.activity_logs REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
