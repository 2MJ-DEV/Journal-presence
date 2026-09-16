ALTER TABLE "LabMovement" ADD COLUMN "eventId" TEXT;
UPDATE "LabMovement" SET "eventId" = "id" WHERE "eventId" IS NULL;
ALTER TABLE "LabMovement" ALTER COLUMN "eventId" SET NOT NULL;
ALTER TABLE "LabMovement" ALTER COLUMN "eventId" SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX "LabMovement_eventId_key" ON "LabMovement"("eventId");
