Drop database if exists Employee;
Create database if not exists Employee;
Use Employee;

#-----Create table
Create table if not exists people (
	id int auto_increment not null,
    fname varchar(100) not null,
    age int,
    sex char,
    email varchar(30),
    cccd varchar(20) unique not null,
    address varchar(100),
    primary key(id),
    unique(cccd)
);

Create table if not exists employee (
	id int not null primary key,
    sid int
);

Create table if not exists full_time_emp (
	id int not null primary key,
    salary int
);

Create table if not exists part_time_emp (
	id int not null primary key,
    salary int
);

Create table if not exists shift (
	sched_id int auto_increment not null primary key,
	id int not null,
    start_hour time,
    end_hour time,
    start_date date
);

Create table if not exists work_at (
	id int not null primary key,
    place_id int not null,
    job varchar(100),
    total_hours int
);

Create table if not exists place (
	place_id int not null primary key,
    address varchar(100),
    address2 varchar(100)
);

-- Add foreign keys

Alter table employee
Add foreign key (id) references people(id) on update cascade on delete cascade;

Alter table employee
Add foreign key (sid) references employee(id) on update cascade on delete set null;

Alter table full_time_emp
Add foreign key (id) references employee(id) on update cascade on delete cascade;

Alter table part_time_emp
Add foreign key (id) references employee(id) on update cascade on delete cascade;

Alter table shift
Add foreign key (id) references employee(id) on update cascade on delete cascade;

Alter table work_at 
Add foreign key (id) references employee(id) on update cascade on delete cascade;

Alter table work_at
Add foreign key (place_id) references place(place_id);

#-----Add procedure

DROP PROCEDURE IF EXISTS show_info;
Delimiter $$
CREATE PROCEDURE show_info()
BEGIN
    SELECT emp.id, emp.fname as empname, emp.age, emp.sex, emp.address, sup.fname as supname, sup.id as sid, "FULL TIME" as job_type, fte.salary
    FROM full_time_emp as fte
    JOIN
		employee ON fte.id = employee.id
    JOIN
		people as emp ON emp.id = employee.id
	LEFT JOIN
		people as sup ON sup.id = employee.sid
        
	UNION
    SELECT emp.id, emp.fname as empname, emp.age, emp.sex, emp.address, sup.fname as supname, sup.id as sid, "PART TIME" as job_type, pte.salary
    FROM part_time_emp as pte
    JOIN
		employee ON pte.id = employee.id
    JOIN
		people as emp ON emp.id = employee.id
	LEFT JOIN
		people as sup ON sup.id = employee.sid;
END $$
Delimiter ;

DROP PROCEDURE IF EXISTS getEmployeeByID;
Delimiter $$
CREATE PROCEDURE getEmployeeByID(in id int)
BEGIN
	SELECT emp.id, emp.fname as empname, emp.sex, emp.cccd, emp.email, emp.address, emp.age, sup.fname as supname, sup.id as sid,"FULL TIME" as job_type, fte.salary
    FROM full_time_emp as fte
    JOIN
		employee ON fte.id = employee.id
    JOIN
		people as emp ON emp.id = employee.id
	LEFT JOIN
		people as sup ON sup.id = employee.sid
    WHERE emp.id = id
	UNION
    SELECT emp.id, emp.fname as empname, emp.sex, emp.cccd, emp.email, emp.address, emp.age, sup.fname as supname, sup.id as sid, "PART TIME" as job_type, pte.salary
    FROM part_time_emp as pte
    JOIN
		employee ON pte.id = employee.id
    JOIN
		people as emp ON emp.id = employee.id
	LEFT JOIN
		people as sup ON sup.id = employee.sid
	WHERE emp.id = id;
END $$
Delimiter ;

DROP PROCEDURE IF EXISTS add_employee;
Delimiter $$
CREATE PROCEDURE add_employee(in new_fname varchar(100), in new_age int, in new_sex char, in new_email varchar(30), in new_cccd varchar(20), in new_address varchar(100), in new_sid int, in job_type char(10), in nsalary int)
BEGIN
	Insert into people (fname, age, sex, email, cccd, address)
    Values (new_fname, new_age, new_sex, new_email, new_cccd, new_address);
    Insert into employee (id, sid)
    Values (LAST_INSERT_ID(), new_sid);
    IF job_type = 'FULL TIME' THEN
		Insert into full_time_emp(id, salary)
        values (LAST_INSERT_ID(), nsalary);
	ELSE
		Insert into part_time_emp(id, salary)
        values (LAST_INSERT_ID(), nsalary);
	END IF;
END $$
Delimiter ;

DROP PROCEDURE IF EXISTS alter_employee;
Delimiter $$
CREATE PROCEDURE alter_employee(in inid int, in new_fname varchar(100), in new_age int, in new_sex char, in new_email varchar(30), in new_cccd varchar(20), in new_address varchar(100), in new_sid int, in job_type varchar(10), in salary int)
BEGIN
	UPDATE people
    SET fname = new_fname,
		age = new_age,
        sex = new_sex,
        email = new_email,
        cccd = new_cccd,
        address = new_address
	WHERE people.id = inid;
    UPDATE employee
    SET sid = new_sid
    WHERE employee.id = inid;
    IF job_type = "FULL TIME" THEN
		INSERT IGNORE INTO full_time_emp VALUES (inid, salary);
        DELETE FROM part_time_emp WHERE part_time_emp.id = inid;
	ELSE 
		INSERT IGNORE  INTO part_time_emp VALUES (inid, salary);
        DELETE FROM full_time_emp WHERE full_time_emp.id = inid;
	END IF;
END $$
Delimiter ;

DROP PROCEDURE IF EXISTS checkSchedule;
Delimiter $$
CREATE PROCEDURE checkSchedule(in sc int,in i int,in s time,in e time,in d date)
BEGIN
	SELECT sched_id, id, start_hour, end_hour, start_date
	FROM shift
	WHERE sched_id != sc  -- Exclude the current shift to avoid checking against itself
	AND start_date = d   -- Check if the shifts are on the same date
	AND (
		(s < end_hour AND e > start_hour)
	) AND id = i;
END $$
Delimiter ;

DROP PROCEDURE IF EXISTS checkScheduleAlt;
Delimiter $$
CREATE PROCEDURE checkScheduleAlt(in i int,in s time,in e time,in d date)
BEGIN
	SELECT sched_id, id, start_hour, end_hour, start_date
	FROM shift
	WHERE start_date = d   -- Check if the shifts are on the same date
	AND (
		(s < end_hour AND e > start_hour)
	) AND id = i;
END $$
Delimiter ;


#--Insert

Insert into place values 
(1, 'Di An', 'Binh Duong'),
(2, 'Ly Thuong Kiet', 'Quan 10');


CALL add_employee('John Doe', 28, 'M', 'john.doe@example.com', '123-45-6789', '123 Main St', NULL, 'FULL TIME', 50000);
CALL add_employee('Jane Smith', 34, 'F', 'jane.smith@example.com', '234-56-7890', '456 Oak St',NULL, 'PART TIME', 25000);
CALL add_employee('Alice Johnson', 30, 'F', 'alice.johnson@example.com', '345-67-8901', '789 Pine St',NULL, 'FULL TIME', 55000);
CALL add_employee('Bob Brown', 25, 'M', 'bob.brown@example.com', '456-78-9012', '101 Maple St',NULL, 'PART TIME', 22000);
CALL add_employee('Charlie Lee', 40, 'M', 'charlie.lee@example.com', '567-89-0123', '202 Birch St',NULL, 'FULL TIME', 60000);
CALL add_employee('Diana Clark', 29, 'F', 'diana.clark@example.com', '678-90-1234', '303 Cedar St',NULL, 'PART TIME', 27000);
CALL add_employee('Ethan Davis', 45, 'M', 'ethan.davis@example.com', '789-01-2345', '404 Spruce St', NULL,'FULL TIME', 70000);
CALL add_employee('Fiona White', 33, 'F', 'fiona.white@example.com', '890-12-3456', '505 Fir St', NULL,'FULL TIME', 65000);
CALL add_employee('George Wilson', 38, 'M', 'george.wilson@example.com', '901-23-4567', '606 Ash St',NULL, 'PART TIME', 32000);
CALL add_employee('Hannah Evans', 27, 'F', 'hannah.evans@example.com', '012-34-5678', '707 Redwood St',NULL, 'FULL TIME', 48000);
CALL add_employee('Ian Scott', 31, 'M', 'ian.scott@example.com', '123-45-6787', '808 Willow St', NULL,'PART TIME', 21000);
CALL add_employee('Jack Harris', 26, 'M', 'jack.harris@example.com', '234-56-7897', '909 Elm St', NULL,'FULL TIME', 53000);
CALL add_employee('Kelly Martin', 35, 'F', 'kelly.martin@example.com', '345-67-8907', '101 Birch St', NULL,'FULL TIME', 60000);
CALL add_employee('Liam Moore', 32, 'M', 'liam.moore@example.com', '456-78-9017', '202 Maple St', NULL,'PART TIME', 29000);
CALL add_employee('Monica Taylor', 29, 'F', 'monica.taylor@example.com', '567-89-0127', '303 Oak St', NULL,'FULL TIME', 57000);
CALL add_employee('Nathan Perez', 37, 'M', 'nathan.perez@example.com', '678-90-1237', '404 Pine St',NULL, 'PART TIME', 33000);
CALL add_employee('Olivia Adams', 41, 'F', 'olivia.adams@example.com', '789-01-2347', '505 Cedar St',NULL, 'FULL TIME', 62000);
CALL add_employee('Paul Robinson', 33, 'M', 'paul.robinson@example.com', '890-12-3457', '606 Fir St', NULL,'FULL TIME', 65000);
CALL add_employee('Quinn Thomas', 28, 'M', 'quinn.thomas@example.com', '901-23-4569', '707 Ash St', NULL,'PART TIME', 25000);
CALL add_employee('Rachel Lee', 27, 'F', 'rachel.lee@example.com', '012-34-5677', '808 Redwood St', NULL,'FULL TIME', 49000);

CALL show_info();



CALL show_info();
