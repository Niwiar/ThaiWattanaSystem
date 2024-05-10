/*
  Warnings:

  - You are about to drop the column `paymentId` on the `employeePayment` table. All the data in the column will be lost.
  - Added the required column `paymentEmployeeId` to the `employeePayment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[employeePayment] DROP CONSTRAINT [employeePayment_paymentId_fkey];

-- AlterTable
ALTER TABLE [dbo].[employeePayment] DROP COLUMN [paymentId];
ALTER TABLE [dbo].[employeePayment] ADD [paymentEmployeeId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[paymentEmployee] (
    [id] INT NOT NULL IDENTITY(1,1),
    [paymentId] INT NOT NULL,
    [employeeId] INT NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [paymentEmployee_active_df] DEFAULT 1,
    CONSTRAINT [paymentEmployee_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[paymentEmployee] ADD CONSTRAINT [paymentEmployee_paymentId_fkey] FOREIGN KEY ([paymentId]) REFERENCES [dbo].[payment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[paymentEmployee] ADD CONSTRAINT [paymentEmployee_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_paymentEmployeeId_fkey] FOREIGN KEY ([paymentEmployeeId]) REFERENCES [dbo].[paymentEmployee]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
