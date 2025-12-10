-- CreateEnum
CREATE TYPE "AttendanceSessionStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- AlterTable
ALTER TABLE "assignment_submissions" ADD COLUMN     "groupId" TEXT;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "isSeparateSubmission" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "comment_attachments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_votes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_attachments" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_sessions" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Điểm danh',
    "sessionCode" TEXT NOT NULL,
    "status" "AttendanceSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_check_ins" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comment_attachments_commentId_idx" ON "comment_attachments"("commentId");

-- CreateIndex
CREATE INDEX "comment_votes_commentId_idx" ON "comment_votes"("commentId");

-- CreateIndex
CREATE INDEX "comment_votes_userId_idx" ON "comment_votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_votes_commentId_userId_key" ON "comment_votes"("commentId", "userId");

-- CreateIndex
CREATE INDEX "class_attachments_classId_idx" ON "class_attachments"("classId");

-- CreateIndex
CREATE INDEX "class_attachments_uploaderId_idx" ON "class_attachments"("uploaderId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_sessions_sessionCode_key" ON "attendance_sessions"("sessionCode");

-- CreateIndex
CREATE INDEX "attendance_sessions_classId_idx" ON "attendance_sessions"("classId");

-- CreateIndex
CREATE INDEX "attendance_sessions_sessionCode_idx" ON "attendance_sessions"("sessionCode");

-- CreateIndex
CREATE INDEX "attendance_sessions_status_idx" ON "attendance_sessions"("status");

-- CreateIndex
CREATE INDEX "attendance_check_ins_sessionId_idx" ON "attendance_check_ins"("sessionId");

-- CreateIndex
CREATE INDEX "attendance_check_ins_studentId_idx" ON "attendance_check_ins"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_check_ins_sessionId_studentId_key" ON "attendance_check_ins"("sessionId", "studentId");

-- CreateIndex
CREATE INDEX "assignment_submissions_groupId_idx" ON "assignment_submissions"("groupId");

-- AddForeignKey
ALTER TABLE "comment_attachments" ADD CONSTRAINT "comment_attachments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_attachments" ADD CONSTRAINT "class_attachments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_attachments" ADD CONSTRAINT "class_attachments_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_check_ins" ADD CONSTRAINT "attendance_check_ins_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_check_ins" ADD CONSTRAINT "attendance_check_ins_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
