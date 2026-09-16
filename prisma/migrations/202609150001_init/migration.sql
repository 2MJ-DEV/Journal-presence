CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "MovementType" AS ENUM ('ENTRY', 'EXIT');
CREATE TYPE "MovementSource" AS ENUM ('SIMULATED', 'VISION', 'IMPORTED');
CREATE TYPE "SessionStatus" AS ENUM ('OPEN', 'CLOSED', 'UNKNOWN');
CREATE TYPE "CameraStatus" AS ENUM ('ONLINE', 'OFFLINE', 'UNKNOWN');
CREATE TYPE "CameraEventType" AS ENUM ('ONLINE', 'OFFLINE');

CREATE TABLE "Student" (
  "id" TEXT NOT NULL,
  "studentNumber" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "department" TEXT,
  "promotion" TEXT,
  "photoUrl" TEXT,
  "faceEmbedding" JSONB,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LabMovement" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "type" "MovementType" NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL,
  "confidence" DOUBLE PRECISION,
  "cameraId" TEXT,
  "source" "MovementSource" NOT NULL DEFAULT 'SIMULATED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LabMovement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LabSession" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "entryAt" TIMESTAMP(3) NOT NULL,
  "exitAt" TIMESTAMP(3),
  "duration" INTEGER,
  "status" "SessionStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LabSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Camera" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "location" TEXT,
  "status" "CameraStatus" NOT NULL DEFAULT 'UNKNOWN',
  "lastSeenAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CameraEvent" (
  "id" TEXT NOT NULL,
  "cameraId" TEXT NOT NULL,
  "type" "CameraEventType" NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "endedAt" TIMESTAMP(3),
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CameraEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");
CREATE INDEX "LabMovement_studentId_timestamp_idx" ON "LabMovement"("studentId", "timestamp");
CREATE INDEX "LabMovement_timestamp_idx" ON "LabMovement"("timestamp");
CREATE INDEX "LabSession_studentId_entryAt_idx" ON "LabSession"("studentId", "entryAt");
CREATE INDEX "CameraEvent_cameraId_startedAt_idx" ON "CameraEvent"("cameraId", "startedAt");

ALTER TABLE "LabMovement" ADD CONSTRAINT "LabMovement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LabMovement" ADD CONSTRAINT "LabMovement_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LabSession" ADD CONSTRAINT "LabSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CameraEvent" ADD CONSTRAINT "CameraEvent_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
