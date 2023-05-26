/*
  Warnings:

  - You are about to alter the column `stack` on the `AppLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `AppLog` MODIFY `stack` JSON NULL;
