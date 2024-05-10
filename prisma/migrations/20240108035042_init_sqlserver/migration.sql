/*
  Warnings:

  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstname` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `employee` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `employeeId` on the `employeeAttendance` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to drop the column `leaveType` on the `employeeLeave` table. All the data in the column will be lost.
  - You are about to alter the column `employeeId` on the `employeeLeave` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to drop the column `employeeId` on the `employeePayment` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `employeePayment` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `employeePayment` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `employeePayment` table. The data in that column could be lost. The data in that column will be cast from `DateTime2` to `Date`.
  - You are about to drop the column `payType` on the `position` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `position` table. All the data in the column will be lost.
  - You are about to drop the `mdWorking` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[employeeCode]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeCode` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveBusiness` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveSick` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payType` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `employeeLeave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `employeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingId` to the `employeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payType` to the `employeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `employeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `employeePayment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[employeeAttendance] DROP CONSTRAINT [employeeAttendance_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeeLeave] DROP CONSTRAINT [employeeLeave_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeePayment] DROP CONSTRAINT [employeePayment_employeeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_pkey];
ALTER TABLE [dbo].[employee] ALTER COLUMN [id] INT NOT NULL;
ALTER TABLE [dbo].[employee] DROP COLUMN [firstname],
[lastname];
ALTER TABLE [dbo].[employee] ADD CONSTRAINT employee_pkey PRIMARY KEY CLUSTERED ([id]);
ALTER TABLE [dbo].[employee] ADD [bankAccountHolder] NVARCHAR(1000),
[bankAccountNo] NVARCHAR(1000),
[bankName] NVARCHAR(1000),
[employeeCode] NVARCHAR(1000) NOT NULL,
[leaveBusiness] INT NOT NULL,
[leaveSick] INT NOT NULL,
[name] NVARCHAR(1000) NOT NULL,
[payType] INT NOT NULL,
[roleId] INT,
[salary] FLOAT(53) NOT NULL,
[socialServiceId] NVARCHAR(1000),
[teamId] INT,
[workdate] DATE;

-- AlterTable
ALTER TABLE [dbo].[employeeAttendance] ALTER COLUMN [employeeId] INT NOT NULL;
ALTER TABLE [dbo].[employeeAttendance] ADD [date] DATE NOT NULL CONSTRAINT [employeeAttendance_date_df] DEFAULT CURRENT_TIMESTAMP,
[imageFile] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[employeeLeave] ALTER COLUMN [employeeId] INT NOT NULL;
ALTER TABLE [dbo].[employeeLeave] DROP COLUMN [leaveType];
ALTER TABLE [dbo].[employeeLeave] ADD [period] INT,
[type] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[employeePayment] ALTER COLUMN [date] DATE NOT NULL;
ALTER TABLE [dbo].[employeePayment] DROP COLUMN [employeeId],
[endTime],
[startTime];
ALTER TABLE [dbo].[employeePayment] ADD [amount] FLOAT(53) NOT NULL,
[billingId] BIGINT NOT NULL,
[payType] INT NOT NULL,
[period] FLOAT(53) NOT NULL,
[type] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[position] DROP COLUMN [payType],
[salary];

-- DropTable
DROP TABLE [dbo].[mdWorking];

-- CreateTable
CREATE TABLE [dbo].[working] (
    [id] INT NOT NULL IDENTITY(1,1),
    [workday] NVARCHAR(1000) NOT NULL,
    [startWorktime] NVARCHAR(1000) NOT NULL,
    [stopWorktime] NVARCHAR(1000) NOT NULL,
    [lateTime] NVARCHAR(1000) NOT NULL,
    [updateAt] DATETIME2 NOT NULL CONSTRAINT [working_updateAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [working_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[team] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [team_active_df] DEFAULT 1,
    CONSTRAINT [team_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [team_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [teamId] INT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [role_active_df] DEFAULT 1,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[billing] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [month] NVARCHAR(1000) NOT NULL,
    [employeeId] INT NOT NULL,
    [payDate] DATE,
    [salary] FLOAT(53),
    [income] FLOAT(53),
    [deduction] FLOAT(53),
    CONSTRAINT [billing_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_employeeCode_key] UNIQUE NONCLUSTERED ([employeeCode]);

-- AddForeignKey
ALTER TABLE [dbo].[role] ADD CONSTRAINT [role_teamId_fkey] FOREIGN KEY ([teamId]) REFERENCES [dbo].[team]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeAttendance] ADD CONSTRAINT [employeeAttendance_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeLeave] ADD CONSTRAINT [employeeLeave_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_billingId_fkey] FOREIGN KEY ([billingId]) REFERENCES [dbo].[billing]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[billing] ADD CONSTRAINT [billing_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
