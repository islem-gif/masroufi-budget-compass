
-- Activer RLS sur toutes les tables (si pas déjà activé)
DO $$
BEGIN
    -- Activer RLS pour transactions
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'transactions' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'categories' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour budgets
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'budgets' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour financial_goals
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'financial_goals' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour notifications
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'notifications' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour users
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'users' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Activer RLS pour deals
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'deals' 
        AND schemaname = 'public' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Supprimer les politiques existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

DROP POLICY IF EXISTS "Users can view their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can create their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON public.budgets;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.financial_goals;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

DROP POLICY IF EXISTS "Anyone can view deals" ON public.deals;

-- Créer les nouvelles politiques
-- Politiques pour la table transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques pour la table categories
CREATE POLICY "Users can view their own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques pour la table budgets
CREATE POLICY "Users can view their own budgets" 
  ON public.budgets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
  ON public.budgets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
  ON public.budgets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
  ON public.budgets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques pour la table financial_goals
CREATE POLICY "Users can view their own goals" 
  ON public.financial_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
  ON public.financial_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON public.financial_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON public.financial_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques pour la table notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON public.notifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques pour la table users
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Politique pour que tout le monde puisse voir les deals (publics)
CREATE POLICY "Anyone can view deals" 
  ON public.deals 
  FOR SELECT 
  USING (true);
