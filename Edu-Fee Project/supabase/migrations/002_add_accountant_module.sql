-- ============================================================
-- EduFee — Add Accountant Module and Reorganize Responsibilities
-- Migration to add accountant role and financial fields
-- ============================================================

-- Update profiles role check to include accountant
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin','student','accountant'));

-- Remove unique constraint on student_id in fee_assignments to allow multiple assignments (for multiple semesters)
ALTER TABLE public.fee_assignments DROP CONSTRAINT IF EXISTS fee_assignments_student_id_key;

-- Add semester field to fee_assignments
ALTER TABLE public.fee_assignments ADD COLUMN IF NOT EXISTS semester TEXT;

-- Add financial fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS scholarship_percentage NUMERIC(5,2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS waiver BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_fines NUMERIC(8,2) DEFAULT 0;

-- Add table for fines tracking
CREATE TABLE IF NOT EXISTS public.fines (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_id INT NOT NULL REFERENCES public.fee_assignments(id) ON DELETE CASCADE,
  installment_no INT NOT NULL,
  amount NUMERIC(8,2) NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Late payment',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update RLS policies to include accountant
-- For simplicity, accountants have similar access to admins for fee-related tables

-- Profiles: accountants can read all profiles
CREATE POLICY "Accountants can read all profiles"
  ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );

-- Fee plans: accountants can manage
CREATE POLICY "Accountants can manage fee plans"
  ON public.fee_plans FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );

-- Assignments: accountants can manage
CREATE POLICY "Accountants can manage assignments"
  ON public.fee_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );

-- Payments: accountants can manage
CREATE POLICY "Accountants can manage payments"
  ON public.payments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );

-- Fines: accountants can manage
CREATE POLICY "Accountants can manage fines"
  ON public.fines FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );

-- Notifications: accountants can read all
CREATE POLICY "Accountants can read notifications"
  ON public.notifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'accountant')
  );</content>
<parameter name="filePath">c:\Users\abc\Downloads\Edu-Fee project (1)\Edu-Fee project\edufee\supabase\migrations\002_add_accountant_module.sql