-- AlterTable
ALTER TABLE "ContactLead" ADD COLUMN     "attachmentBytes" INTEGER,
ADD COLUMN     "attachmentKey" TEXT,
ADD COLUMN     "attachmentMime" TEXT,
ADD COLUMN     "attachmentName" TEXT,
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "source" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX "ContactLead_attachmentKey_key" ON "ContactLead"("attachmentKey");
