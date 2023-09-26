BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [permission] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[mdWorking] (
    [id] INT NOT NULL IDENTITY(1,1),
    [workday] NVARCHAR(1000) NOT NULL,
    [startWorktime] TIME NOT NULL,
    [stopWorktime] TIME NOT NULL,
    [leaveBusiness] INT NOT NULL,
    [leaveSick] INT NOT NULL,
    [updateAt] DATETIME2 NOT NULL CONSTRAINT [mdWorking_updateAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mdWorking_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mdHoliday] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATE NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mdHoliday_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mdPosition] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [salary] FLOAT(53) NOT NULL,
    [payType] INT NOT NULL,
    CONSTRAINT [mdPosition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mdPosition_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[mdPayment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [payType] INT NOT NULL,
    CONSTRAINT [mdPayment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mdPayment_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[employee] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstname] NVARCHAR(1000) NOT NULL,
    [lastname] NVARCHAR(1000),
    [birthdate] DATE,
    [gender] INT,
    [address] NVARCHAR(1000),
    [tel] NVARCHAR(1000),
    [nationality] NVARCHAR(1000),
    [citizenId] NVARCHAR(1000),
    [citizenCardFile] NVARCHAR(1000),
    [jobApplicationFile] NVARCHAR(1000),
    [imageFile] NVARCHAR(1000),
    [workPermitFile] NVARCHAR(1000),
    [positionId] INT NOT NULL,
    CONSTRAINT [employee_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[employeeAttendance] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [employeeId] INT NOT NULL,
    [createdBy] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employeeAttendance_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [employeeAttendance_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[employeeLeave] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [employeeId] INT NOT NULL,
    [leaveType] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employeeLeave_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] INT,
    CONSTRAINT [employeeLeave_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[employeePayment] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [employeeId] INT NOT NULL,
    [paymentId] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [startTime] TIME NOT NULL,
    [endTime] TIME NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employeePayment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] INT,
    CONSTRAINT [employeePayment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[employee] ADD CONSTRAINT [employee_positionId_fkey] FOREIGN KEY ([positionId]) REFERENCES [dbo].[mdPosition]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeAttendance] ADD CONSTRAINT [employeeAttendance_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeAttendance] ADD CONSTRAINT [employeeAttendance_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeLeave] ADD CONSTRAINT [employeeLeave_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeeLeave] ADD CONSTRAINT [employeeLeave_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[employeePayment] ADD CONSTRAINT [employeePayment_paymentId_fkey] FOREIGN KEY ([paymentId]) REFERENCES [dbo].[mdPayment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
