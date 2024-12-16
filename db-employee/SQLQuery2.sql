

-- Check if database exists, and drop it if it does
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Employee')
BEGIN
    DROP DATABASE Employee;
END

-- Check if database exists, and drop it if it does
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Employee')
BEGIN
    CREATE DATABASE Employee;
END



-- Create tables
IF OBJECT_ID('shift', 'U') IS NOT NULL DROP TABLE shift;
IF OBJECT_ID('part_time_emp', 'U') IS NOT NULL DROP TABLE part_time_emp;
IF OBJECT_ID('full_time_emp', 'U') IS NOT NULL DROP TABLE full_time_emp;
IF OBJECT_ID('employee', 'U') IS NOT NULL DROP TABLE employee;
IF OBJECT_ID('people', 'U') IS NOT NULL DROP TABLE people;

CREATE TABLE people (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    fname NVARCHAR(100) NOT NULL,
    age INT,
    sex CHAR(1),
    email NVARCHAR(30),
    cccd NVARCHAR(20) UNIQUE NOT NULL,
    address NVARCHAR(100)
);

CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY FOREIGN KEY REFERENCES people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sid INT NULL FOREIGN KEY (sid) REFERENCES employee(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);



CREATE TABLE full_time_emp (
    id INT NOT NULL PRIMARY KEY FOREIGN KEY REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    salary INT
);


CREATE TABLE part_time_emp (
    id INT NOT NULL PRIMARY KEY FOREIGN KEY REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    salary INT
);

CREATE TABLE shift (
    sched_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    id INT NOT NULL FOREIGN KEY REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    start_hour TIME,
    end_hour TIME,
    start_date DATE
);


IF OBJECT_ID('trg_DeleteEmployee', 'TR') IS NOT NULL DROP TRIGGER trg_DeleteEmployee;
GO
CREATE TRIGGER trg_DeleteEmployee 
ON employee
AFTER DELETE
AS
BEGIN
	UPDATE employee
	SET sid = NULL
	WHERE sid in (SELECT id FROM DELETED);
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('show_info', 'P') IS NOT NULL DROP PROCEDURE show_info;
GO
CREATE PROCEDURE show_info
AS
BEGIN
    SELECT emp.id, emp.fname AS empname, emp.age, emp.sex, emp.address, 
           sup.fname AS supname, sup.id AS sid, 'FULL TIME' AS job_type, fte.salary
    FROM full_time_emp fte
    JOIN employee ON fte.id = employee.id
    JOIN people emp ON emp.id = employee.id
    LEFT JOIN people sup ON sup.id = employee.sid

    UNION

    SELECT emp.id, emp.fname AS empname, emp.age, emp.sex, emp.address, 
           sup.fname AS supname, sup.id AS sid, 'PART TIME' AS job_type, pte.salary
    FROM part_time_emp pte
    JOIN employee ON pte.id = employee.id
    JOIN people emp ON emp.id = employee.id
    LEFT JOIN people sup ON sup.id = employee.sid;
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('getEmployeeByID', 'P') IS NOT NULL DROP PROCEDURE getEmployeeByID;
GO
CREATE PROCEDURE getEmployeeByID @id INT
AS
BEGIN
    SELECT emp.id, emp.fname AS empname, emp.sex, emp.cccd, emp.email, emp.address, emp.age, 
           sup.fname AS supname, sup.id AS sid, 'FULL TIME' AS job_type, fte.salary
    FROM full_time_emp fte
    JOIN employee ON fte.id = employee.id
    JOIN people emp ON emp.id = employee.id
    LEFT JOIN people sup ON sup.id = employee.sid
    WHERE emp.id = @id

    UNION

    SELECT emp.id, emp.fname AS empname, emp.sex, emp.cccd, emp.email, emp.address, emp.age, 
           sup.fname AS supname, sup.id AS sid, 'PART TIME' AS job_type, pte.salary
    FROM part_time_emp pte
    JOIN employee ON pte.id = employee.id
    JOIN people emp ON emp.id = employee.id
    LEFT JOIN people sup ON sup.id = employee.sid
    WHERE emp.id = @id;
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('add_employee', 'P') IS NOT NULL DROP PROCEDURE add_employee;
GO
CREATE PROCEDURE add_employee 
    @new_fname NVARCHAR(100), 
    @new_age INT, 
    @new_sex CHAR(1), 
    @new_email NVARCHAR(30), 
    @new_cccd NVARCHAR(20), 
    @new_address NVARCHAR(100), 
    @new_sid INT, 
    @job_type CHAR(10), 
    @nsalary INT
AS
BEGIN
    INSERT INTO people (fname, age, sex, email, cccd, address)
    VALUES (@new_fname, @new_age, @new_sex, @new_email, @new_cccd, @new_address);

    DECLARE @last_id INT = SCOPE_IDENTITY();

    INSERT INTO employee (id, sid)
    VALUES (@last_id, @new_sid);

    IF @job_type = 'FULL TIME'
    BEGIN
        INSERT INTO full_time_emp (id, salary)
        VALUES (@last_id, @nsalary);
    END
    ELSE
    BEGIN
        INSERT INTO part_time_emp (id, salary)
        VALUES (@last_id, @nsalary);
    END
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('alter_employee', 'P') IS NOT NULL DROP PROCEDURE alter_employee;
GO
CREATE PROCEDURE alter_employee 
    @inid INT, 
    @new_fname NVARCHAR(100), 
    @new_age INT, 
    @new_sex CHAR(1), 
    @new_email NVARCHAR(30), 
    @new_cccd NVARCHAR(20), 
    @new_address NVARCHAR(100), 
    @new_sid INT, 
    @job_type NVARCHAR(10), 
    @salary INT
AS
BEGIN
    UPDATE people
    SET fname = @new_fname, 
        age = @new_age, 
        sex = @new_sex, 
        email = @new_email, 
        cccd = @new_cccd, 
        address = @new_address
    WHERE id = @inid;

    UPDATE employee
    SET sid = @new_sid
    WHERE id = @inid;

    IF @job_type = 'FULL TIME'
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM full_time_emp WHERE id = @inid)
        BEGIN
            INSERT INTO full_time_emp (id, salary)
            VALUES (@inid, @salary);
        END
        DELETE FROM part_time_emp WHERE id = @inid;
    END
    ELSE
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM part_time_emp WHERE id = @inid)
        BEGIN
            INSERT INTO part_time_emp (id, salary)
            VALUES (@inid, @salary);
        END
        DELETE FROM full_time_emp WHERE id = @inid;
    END
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('checkSchedule', 'P') IS NOT NULL DROP PROCEDURE checkSchedule;
GO
CREATE PROCEDURE checkSchedule 
    @sc INT, 
    @i INT, 
    @s TIME, 
    @e TIME, 
    @d DATE
AS
BEGIN
    SELECT sched_id, id, start_hour, end_hour, start_date
    FROM shift
    WHERE sched_id != @sc
      AND start_date = @d
      AND (@s < end_hour AND @e > start_hour)
      AND id = @i;
END;
GO

-- Drop Procedure if Exists
IF OBJECT_ID('checkScheduleAlt', 'P') IS NOT NULL DROP PROCEDURE checkScheduleAlt;
GO
CREATE PROCEDURE checkScheduleAlt 
    @i INT, 
    @s TIME, 
    @e TIME, 
    @d DATE
AS
BEGIN
    SELECT sched_id, id, start_hour, end_hour, start_date
    FROM shift
    WHERE start_date = @d
      AND (@s < end_hour AND @e > start_hour)
      AND id = @i;
END;
GO

EXEC add_employee 'John Doe', 28, 'M', 'john.doe@example.com', '123-45-6789', '123 Main St', NULL, 'FULL TIME', 50000;
EXEC add_employee 'Jane Smith', 34, 'F', 'jane.smith@example.com', '234-56-7890', '456 Oak St', NULL, 'PART TIME', 25000;
EXEC add_employee 'Alice Johnson', 30, 'F', 'alice.johnson@example.com', '345-67-8901', '789 Pine St', NULL, 'FULL TIME', 55000;
EXEC add_employee 'Bob Brown', 25, 'M', 'bob.brown@example.com', '456-78-9012', '101 Maple St', NULL, 'PART TIME', 22000;
EXEC add_employee 'Charlie Lee', 40, 'M', 'charlie.lee@example.com', '567-89-0123', '202 Birch St', NULL, 'FULL TIME', 60000;
EXEC add_employee 'Diana Clark', 29, 'F', 'diana.clark@example.com', '678-90-1234', '303 Cedar St', NULL, 'PART TIME', 27000;
EXEC add_employee 'Ethan Davis', 45, 'M', 'ethan.davis@example.com', '789-01-2345', '404 Spruce St', 2, 'FULL TIME', 70000;
EXEC add_employee 'Fiona White', 33, 'F', 'fiona.white@example.com', '890-12-3456', '505 Fir St', 2, 'FULL TIME', 65000;
EXEC add_employee 'George Wilson', 38, 'M', 'george.wilson@example.com', '901-23-4567', '606 Ash St', 3, 'PART TIME', 32000;
EXEC add_employee 'Hannah Evans', 27, 'F', 'hannah.evans@example.com', '012-34-5678', '707 Redwood St', NULL, 'FULL TIME', 48000;
EXEC add_employee 'Ian Scott', 31, 'M', 'ian.scott@example.com', '123-45-6787', '808 Willow St', NULL, 'PART TIME', 21000;
EXEC add_employee 'Jack Harris', 26, 'M', 'jack.harris@example.com', '234-56-7897', '909 Elm St', NULL, 'FULL TIME', 53000;
EXEC add_employee 'Kelly Martin', 35, 'F', 'kelly.martin@example.com', '345-67-8907', '101 Birch St', 5, 'FULL TIME', 60000;
EXEC add_employee 'Liam Moore', 32, 'M', 'liam.moore@example.com', '456-78-9017', '202 Maple St', NULL, 'PART TIME', 29000;
EXEC add_employee 'Monica Taylor', 29, 'F', 'monica.taylor@example.com', '567-89-0127', '303 Oak St', NULL, 'FULL TIME', 57000;
EXEC add_employee 'Nathan Perez', 37, 'M', 'nathan.perez@example.com', '678-90-1237', '404 Pine St', NULL, 'PART TIME', 33000;
EXEC add_employee 'Olivia Adams', 41, 'F', 'olivia.adams@example.com', '789-01-2347', '505 Cedar St', NULL, 'FULL TIME', 62000;
EXEC add_employee 'Paul Robinson', 33, 'M', 'paul.robinson@example.com', '890-12-3457', '606 Fir St', NULL, 'FULL TIME', 65000;
EXEC add_employee 'Quinn Thomas', 28, 'M', 'quinn.thomas@example.com', '901-23-4569', '707 Ash St', NULL, 'PART TIME', 25000;
EXEC add_employee 'Rachel Lee', 27, 'F', 'rachel.lee@example.com', '012-34-5677', '808 Redwood St', NULL, 'FULL TIME', 49000;

EXEC show_info