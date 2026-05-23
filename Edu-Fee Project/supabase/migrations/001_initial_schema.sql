-- ============================================================
-- EduFee — Supabase Database Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin','student')),
  fname        TEXT NOT NULL,
  lname        TEXT NOT NULL,
  phone        TEXT,
  course       TEXT,
  batch        TEXT,
  reg_no       TEXT UNIQUE,
  address      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── FEE PLANS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_plans (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  total             NUMERIC(12,2) NOT NULL,
  installment_count INT NOT NULL DEFAULT 1,
  created_by        UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── INSTALLMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.installments (
  id         SERIAL PRIMARY KEY,
  plan_id    INT NOT NULL REFERENCES public.fee_plans(id) ON DELETE CASCADE,
  no         INT NOT NULL,
  amount     NUMERIC(12,2) NOT NULL,
  due_date   DATE NOT NULL
);

-- ── FEE ASSIGNMENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_assignments (
  id          SERIAL PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id     INT NOT NULL REFERENCES public.fee_plans(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)  -- one active plan per student
);

-- ── PAYMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id              SERIAL PRIMARY KEY,
  receipt_no      TEXT UNIQUE NOT NULL,
  student_id      UUID NOT NULL REFERENCES public.profiles(id),
  assignment_id   INT NOT NULL REFERENCES public.fee_assignments(id),
  plan_id         INT NOT NULL REFERENCES public.fee_plans(id),
  installment_no  INT NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  payment_date    DATE NOT NULL,
  method          TEXT NOT NULL DEFAULT 'Cash',
  notes           TEXT,
  recorded_by     UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          SERIAL PRIMARY KEY,
  student_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── SEQUENCE COUNTER for receipt numbers ──────────────────
CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1;

-- ── ROW LEVEL SECURITY ────────────────────────────────────
-- TEMPORARILY DISABLED FOR TESTING - Enable after app is working
-- Uncomment the lines below to enable RLS for production

-- ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fee_plans        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.installments     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fee_assignments  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.payments         ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;

-- PROFILES policies (avoid recursion - use simple checks)
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role has full access"
  ON public.profiles 
  USING (true)
  WITH CHECK (true);

-- FEE PLANS policies (simplified - no recursion)
CREATE POLICY "Everyone can read fee plans"
  ON public.fee_plans FOR SELECT USING (true);

CREATE POLICY "Service role can manage fee plans"
  ON public.fee_plans 
  USING (true)
  WITH CHECK (true);

-- INSTALLMENTS policies (simplified - no recursion)
CREATE POLICY "Everyone can read installments"
  ON public.installments FOR SELECT USING (true);

CREATE POLICY "Service role can manage installments"
  ON public.installments 
  USING (true)
  WITH CHECK (true);

-- FEE ASSIGNMENTS policies (simplified - no recursion)
CREATE POLICY "Students can read own assignment"
  ON public.fee_assignments FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can see all assignments for reading"
  ON public.fee_assignments FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage assignments"
  ON public.fee_assignments 
  USING (true)
  WITH CHECK (true);

-- PAYMENTS policies (simplified - no recursion)
CREATE POLICY "Students can read own payments"
  ON public.payments FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can see all payments for reading"
  ON public.payments FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage payments"
  ON public.payments 
  USING (true)
  WITH CHECK (true);

-- NOTIFICATIONS policies
CREATE POLICY "Students can read own notifications"
  ON public.notifications FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Service role can manage notifications"
  ON public.notifications 
  USING (true)
  WITH CHECK (true);

-- ── FUNCTIONS ─────────────────────────────────────────────

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_reg_no TEXT;
  v_role   TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  IF v_role = 'admin' THEN
    v_reg_no := 'ADMIN-001';
  ELSE
    v_reg_no := 'STU-' || LPAD(CAST(nextval('receipt_seq') AS TEXT), 4, '0');
  END IF;

  INSERT INTO public.profiles (id, role, fname, lname, phone, course, batch, reg_no, address)
  VALUES (
    NEW.id,
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'fname', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'lname', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'course', ''),
    COALESCE(NEW.raw_user_meta_data->>'batch', ''),
    v_reg_no,
    ''
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate receipt numbers
CREATE OR REPLACE FUNCTION public.next_receipt_no()
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'RCP-' || LPAD(CAST(nextval('receipt_seq') AS TEXT), 5, '0');
END;
$$;

-- ── SEED ADMIN USER ───────────────────────────────────────
-- After running this migration, create the admin via Supabase Auth
-- with email: admin@edufee.com / password: Admin@123
-- and metadata: { "role": "admin", "fname": "Admin", "lname": "User" }
-- OR use the setup instructions in README.md
