/*
  Warnings:

  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fullname` on the `employee` table. All the data in the column will be lost.
  - Made the column `gender` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_positionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeeAttendance] DROP CONSTRAINT [employeeAttendance_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeeLeave] DROP CONSTRAINT [employeeLeave_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeePayment] DROP CONSTRAINT [employeePayment_employeeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_pkey];
ALTER TABLE [dbo].[employee] ALTER COLUMN [id] BIGINT NOT NULL;
ALTER TABLE [dbo].[employee] ALTER COLUMN [gender] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[employee] ALTER COLUMN [positionId] INT NULL;
ALTER TABLE [dbo].[employee] DROP COLUMN [fullname];
ALTER TABLE [dbo].[employee] ADD CONSTRAINT employee_pkey PRIMARY KEY CLUSTERED ([id]);

-- AlterTable
ALTER TABLE [dbo].[employeeAttendance] ALTER COLUMN [employeeId] BIGINT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[employeeLeave] ALTER COLUMN [employeeId] BIGINT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[employeePayment] ALTER COLUMN [employeeId] BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_positionId_fkey] FOREIGN KEY ([positionId]) REFERENCES [dbo].[mdPosition]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeAttendance] ADD CONSTRAINT [employeeAttendance_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeLeave] ADD CONSTRAINT [employeeLeave_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
