/*
  Warnings:

  - Added the required column `inhaleAngle` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "inhaleAngle" INTEGER NOT NULL;
