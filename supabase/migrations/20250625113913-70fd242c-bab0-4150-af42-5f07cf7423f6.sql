
-- First, drop the foreign key constraint that's causing the issue
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Now we can safely delete all data
DELETE FROM public.notifications;
DELETE FROM public.financial_goals;
DELETE FROM public.budgets;
DELETE FROM public.transactions;
DELETE FROM public.categories;
DELETE FROM public.users;

-- Delete from auth.users (this will cascade to related auth tables)
DELETE FROM auth.users;

-- Recreate the foreign key constraint if it was legitimate
-- (Only uncomment if there was supposed to be a self-referencing relationship)
-- ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
