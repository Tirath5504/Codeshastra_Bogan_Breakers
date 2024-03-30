-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Record" (
    "email" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "correctPosture" BOOLEAN NOT NULL,
    "shakeTime" TIMESTAMP(3) NOT NULL,
    "shakeOrientation" BOOLEAN NOT NULL,
    "shakeCount" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "clickActivation" BOOLEAN NOT NULL,
    "inhaleTime" INTEGER NOT NULL,
    "holdTime" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("email","time")
);

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
