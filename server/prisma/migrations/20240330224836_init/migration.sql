-- CreateTable
CREATE TABLE "Video" (
    "email" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "video_url" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("email","time")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
