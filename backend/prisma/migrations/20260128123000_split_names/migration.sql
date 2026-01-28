-- CreateEnum
CREATE TYPE "PhysicianPrefix" AS ENUM ('Dr', 'NursePractitioner');

-- AlterTable
ALTER TABLE "physicians"
ADD COLUMN "prefix" "PhysicianPrefix" NOT NULL DEFAULT 'Dr',
ADD COLUMN "first_name" TEXT,
ADD COLUMN "last_name" TEXT;

UPDATE "physicians"
SET
  "prefix" = CASE
    WHEN "name" ILIKE 'Dr.%' OR "name" ILIKE 'Dr %' THEN 'Dr'::"PhysicianPrefix"
    WHEN "name" ILIKE 'NP.%' OR "name" ILIKE 'NP %' THEN 'NursePractitioner'::"PhysicianPrefix"
    WHEN "name" ILIKE 'Nurse Practitioner%' THEN 'NursePractitioner'::"PhysicianPrefix"
    ELSE 'Dr'::"PhysicianPrefix"
  END,
  "first_name" = CASE
    WHEN "name" ILIKE 'Dr.%' OR "name" ILIKE 'Dr %' THEN split_part("name", ' ', 2)
    WHEN "name" ILIKE 'NP.%' OR "name" ILIKE 'NP %' THEN split_part("name", ' ', 2)
    WHEN "name" ILIKE 'Nurse Practitioner%' THEN split_part("name", ' ', 3)
    ELSE split_part("name", ' ', 1)
  END,
  "last_name" = CASE
    WHEN "name" ILIKE 'Dr.%' OR "name" ILIKE 'Dr %' THEN split_part("name", ' ', 3)
    WHEN "name" ILIKE 'NP.%' OR "name" ILIKE 'NP %' THEN split_part("name", ' ', 3)
    WHEN "name" ILIKE 'Nurse Practitioner%' THEN split_part("name", ' ', 4)
    ELSE split_part("name", ' ', 2)
  END;

ALTER TABLE "physicians"
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;

ALTER TABLE "physicians" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "patients"
ADD COLUMN "first_name" TEXT,
ADD COLUMN "last_name" TEXT;

UPDATE "patients"
SET
  "first_name" = split_part("name", ' ', 1),
  "last_name" = split_part("name", ' ', 2);

ALTER TABLE "patients"
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;

ALTER TABLE "patients" DROP COLUMN "name";
