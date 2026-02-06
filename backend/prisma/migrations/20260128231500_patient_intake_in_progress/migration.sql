DO $$
BEGIN
  ALTER TYPE "PatientIntakeStatus" ADD VALUE IF NOT EXISTS 'in_progress';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
