BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_roleId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[employee] DROP CONSTRAINT [employee_teamId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_teamId_fkey] FOREIGN KEY ([teamId]) REFERENCES [dbo].[team]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
