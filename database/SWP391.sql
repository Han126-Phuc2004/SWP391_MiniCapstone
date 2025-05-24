-- Tạo CSDL
CREATE DATABASE T2;
GO
USE [T2];
GO

-- Bảng Roles
CREATE TABLE [dbo].[Roles] (
   [rID] INT PRIMARY KEY,
   [rName] VARCHAR(50) NOT NULL
);
INSERT INTO Roles VALUES
(1, 'Admin'),
(2, 'Job Seeker'),
(3, 'Employer');
GO

-- Bảng Accounts
CREATE TABLE [dbo].[Accounts] (
    [accID] INT IDENTITY(1,1) PRIMARY KEY,
    [username] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,  -- Lưu password đã hash ngoài app
    [isVerified] BIT DEFAULT 0,
    [verifyToken] NVARCHAR(255),
    [roleID] INT NOT NULL,
    FOREIGN KEY ([roleID]) REFERENCES Roles([rID])
);
-- Insert lưu ý thứ tự: username, email, password, roleID
INSERT INTO Accounts (username, email, password, roleID) VALUES
('adminUser', 'admin@example.com', 'admin123', 1),
('johnDoe', 'john@example.com', 'pass123', 2),
('janeDoe', 'jane@example.com', 'pass456', 2),
('companyA', 'hr@companyA.com', 'comp123', 3),
('companyB', 'hr@companyB.com', 'comp456', 3);
GO
UPDATE Accounts
SET isVerified = 1, verifyToken = NULL
WHERE email = 'han12060604@gmail.com';

UPDATE Accounts
SET email = 'han12060604@gmail.com'
WHERE email = 'admin@example.com';

-- Bảng JobCategories
CREATE TABLE [dbo].[JobCategories] (
    [jcID] INT IDENTITY(1,1) PRIMARY KEY,
    [jcName] NVARCHAR(100) NOT NULL UNIQUE   
);
INSERT INTO JobCategories (jcName) VALUES
(N'Web Development'),
(N'Graphic Design'),
(N'Content Writing'),
(N'Digital Marketing'),
(N'Mobile App Development');
GO

-- Bảng CVs
CREATE TABLE [dbo].[CVs] (
    [cvID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,                  
    [fullName] NVARCHAR(100) NOT NULL,
    [phone] NVARCHAR(20),
    [address] NVARCHAR(255),
    [gender] NVARCHAR(10),
    [education] NVARCHAR(255),
    [experience] NVARCHAR(MAX),
    [skills] NVARCHAR(MAX),
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE
);
INSERT INTO CVs (accID, fullName, phone, address, gender, education, experience, skills) VALUES
(2, N'John Doe', '0123456789', N'Hà Nội', N'Male', N'ĐH Bách Khoa', N'3 years Web Developer', N'HTML, CSS, JS'),
(3, N'Jane Doe', '0987654321', N'Hồ Chí Minh', N'Female', N'ĐH KHTN', N'2 years Graphic Designer', N'Photoshop, Figma');
GO

-- Bảng OnlineCVs
CREATE TABLE [dbo].[OnlineCVs] (
    [cvID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,
    [title] NVARCHAR(100),
    [dob] DATE,
    [avatar] NVARCHAR(255),
    [skills] NVARCHAR(MAX),
    [experience] NVARCHAR(MAX),
    [certificates] NVARCHAR(MAX),
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE
);
INSERT INTO OnlineCVs (accID, title, dob, avatar, skills, experience, certificates) VALUES
(2, N'Fullstack Dev', '1995-05-12', 'avatar1.jpg', N'Node.js, React', N'3 years freelance', N'IT Cert A'),
(3, N'Graphic Designer', '1997-09-25', 'avatar2.jpg', N'Figma, Illustrator', N'2 years freelance', N'Cert B');
GO

-- Bảng Posts
CREATE TABLE [dbo].[Posts] (
    [pID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,                        
    [jcID] INT NOT NULL,                  
    [title] NVARCHAR(255) NOT NULL,             
    [company] NVARCHAR(255),                   
    [description] NVARCHAR(MAX),               
    [requirement] NVARCHAR(MAX),                 
    [location] NVARCHAR(255),                  
    [salaryMin] DECIMAL(10,2) NULL,   -- Thêm cột lương min
    [salaryMax] DECIMAL(10,2) NULL,   -- Thêm cột lương max
    [salaryCurrency] NVARCHAR(10) NULL, -- USD, VND, ...
    [workingTime] NVARCHAR(100),                
    [jobType] NVARCHAR(50),                      
    [createdAt] DATETIME DEFAULT GETDATE(),      
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE,
    FOREIGN KEY (jcID) REFERENCES JobCategories(jcID)
);
INSERT INTO Posts (accID, jcID, title, company, description, requirement, location, salaryMin, salaryMax, salaryCurrency, workingTime, jobType) VALUES
(4, 1, N'Build E-commerce Site', N'Company A', N'Using ReactJS', N'3+ years, GitHub profile', N'Hanoi', 500, NULL, N'USD', N'Full-time', N'Remote'),
(5, 2, N'Logo for Startup', N'Company B', N'Design logo', N'Portfolio required', N'Saigon', 200, NULL, N'USD', N'Part-time', N'Online');
GO

-- Bảng Applications
CREATE TABLE [dbo].[Applications] (
    [appID] INT IDENTITY(1,1) PRIMARY KEY,
    [cvID] INT NOT NULL,
    [pID] INT NOT NULL,
    [status] NVARCHAR(50) DEFAULT 'Pending',
    [appliedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (cvID) REFERENCES CVs(cvID) ON DELETE CASCADE,       -- giữ cascade trên cvID
    FOREIGN KEY (pID) REFERENCES Posts(pID) ON DELETE NO ACTION      -- bỏ cascade trên pID
);
INSERT INTO Applications (cvID, pID, status) VALUES
(1, 1, 'Pending'),
(2, 2, 'Accepted');
GO

-- Bảng Messages
CREATE TABLE [dbo].[Messages] (
    [msgID] INT IDENTITY(1,1) PRIMARY KEY,
    [senderID] INT NOT NULL,
    [receiverID] INT NOT NULL,
    [content] NVARCHAR(MAX),
    [sentAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (senderID) REFERENCES Accounts(accID) ON DELETE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES Accounts(accID) ON DELETE NO ACTION
);
INSERT INTO Messages (senderID, receiverID, content) VALUES
(2, 4, N'Interested in job post.'),
(4, 2, N'Send portfolio.');
GO

-- Bảng Ratings
CREATE TABLE [dbo].[Ratings] (
    [ratingID] INT IDENTITY(1,1) PRIMARY KEY,
    [employerID] INT NOT NULL,
    [jobSeekerID] INT NOT NULL,
    [rating] INT CHECK (rating BETWEEN 1 AND 5),
    [comment] NVARCHAR(MAX),
    [ratedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employerID) REFERENCES Accounts(accID) ON DELETE CASCADE,
    FOREIGN KEY (jobSeekerID) REFERENCES Accounts(accID) ON DELETE NO ACTION
);
INSERT INTO Ratings (employerID, jobSeekerID, rating, comment) VALUES
(4, 2, 5, N'Excellent work.'),
(5, 3, 4, N'Creative and fast.');
GO

-- Bảng Payments
CREATE TABLE [dbo].[Payments] (
    [paymentID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,
    [amount] DECIMAL(10,2),
    [method] NVARCHAR(50),
    [paidAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE
);
INSERT INTO Payments (accID, amount, method) VALUES
(4, 100.00, N'VNPay');
GO

-- Bảng Blogs
CREATE TABLE [dbo].[Blogs] (
    [blogID] INT IDENTITY(1,1) PRIMARY KEY,
    [adminID] INT NOT NULL,
    [title] NVARCHAR(255),
    [content] NVARCHAR(MAX),
    [createdAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (adminID) REFERENCES Accounts(accID) ON DELETE CASCADE
);
INSERT INTO Blogs (adminID, title, content) VALUES
(1, N'Write a CV', N'How to write a great CV...'),
(1, N'Top Freelance Skills', N'List of top skills...');
GO

-- Bảng Favourites
CREATE TABLE [dbo].[Favourites] (
    [favID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,
    [pID] INT NOT NULL,
    [savedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE,
    FOREIGN KEY (pID) REFERENCES Posts(pID) ON DELETE NO ACTION
);
INSERT INTO Favourites (accID, pID) VALUES
(2, 1),
(3, 2);
GO

-- Bảng ProfileViews
CREATE TABLE [dbo].[ProfileViews] (
    [viewID] INT IDENTITY(1,1) PRIMARY KEY,
    [jobSeekerID] INT NOT NULL,
    [viewerID] INT NOT NULL,
    [viewedAt] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (jobSeekerID) REFERENCES Accounts(accID) ON DELETE CASCADE,
    FOREIGN KEY (viewerID) REFERENCES Accounts(accID) ON DELETE NO ACTION
);
INSERT INTO ProfileViews (jobSeekerID, viewerID) VALUES
(2, 4),
(3, 5);
GO

-- Bảng StaticContents
CREATE TABLE [dbo].[StaticContents] (
    [contentID] INT IDENTITY(1,1) PRIMARY KEY,
    [type] NVARCHAR(50),
    [title] NVARCHAR(255),
    [body] NVARCHAR(MAX),
    [lastUpdated] DATETIME DEFAULT GETDATE()
);
INSERT INTO StaticContents (type, title, body) VALUES
(N'About', N'About Us', N'Connecting freelancers and businesses.'),
(N'Terms', N'Terms of Use', N'You agree to...');
GO

-- Bảng Notifications
CREATE TABLE [dbo].[Notifications] (
    [notificationID] INT IDENTITY(1,1) PRIMARY KEY,
    [accID] INT NOT NULL,
    [message] NVARCHAR(MAX),
    [createdAt] DATETIME DEFAULT GETDATE(),
    [isRead] BIT DEFAULT 0,
    FOREIGN KEY (accID) REFERENCES Accounts(accID) ON DELETE CASCADE
);
INSERT INTO Notifications (accID, message) VALUES
(2, N'Application viewed.'),
(3, N'You got a new rating.');
GO
