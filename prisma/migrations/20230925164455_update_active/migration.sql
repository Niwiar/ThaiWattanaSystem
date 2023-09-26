BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[payment] ADD [active] BIT NOT NULL CONSTRAINT [payment_active_df] DEFAULT 1;

-- AlterTable
ALTER TABLE [dbo].[position] ADD [active] BIT NOT NULL CONSTRAINT [position_active_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
