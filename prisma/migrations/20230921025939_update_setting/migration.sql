/*
  Warnings:

  - You are about to drop the `mdHoliday` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mdPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mdPosition` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_positionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employeePayment] DROP CONSTRAINT [employeePayment_paymentId_fkey];

-- DropTable
DROP TABLE [dbo].[mdHoliday];

-- DropTable
DROP TABLE [dbo].[mdPayment];

-- DropTable
DROP TABLE [dbo].[mdPosition];

-- CreateTable
CREATE TABLE [dbo].[holiday] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATE NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [holiday_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[position] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [salary] FLOAT(53) NOT NULL,
    [payType] INT NOT NULL,
    CONSTRAINT [position_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [position_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[payment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [payType] INT NOT NULL,
    CONSTRAINT [payment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [payment_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_positionId_fkey] FOREIGN KEY ([positionId]) REFERENCES [dbo].[position]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_paymentId_fkey] FOREIGN KEY ([paymentId]) REFERENCES [dbo].[payment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
