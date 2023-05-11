/*
  Warnings:

  - The `price` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `title` on table `Country` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `login` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "title" SET NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "login" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
