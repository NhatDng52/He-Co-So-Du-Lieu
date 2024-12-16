const connection = require('./db');

async function getInfo() {
    try {
        const employees = await connection.query('EXEC show_info');
        console.log(employees)
        return employees['recordset'];
    } catch (err) {
        console.error('Error fetching employees:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function getEmployeeByID(id) {
    try {
        const employee = await connection.query`EXEC getEmployeeByID ${id}` ;
        console.log(employee['recordset']);
        return employee['recordset'];
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function getAllIDName() {
    try {
        const employees = await connection.query(
            'SELECT people.id, people.fname FROM people INNER JOIN employee ON people.id = employee.id'
        );
        return employees['recordset'];
    } catch (err) {
        console.error('Error fetching employees name:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function updateEmployee(id, updatedData) {
    const fname = updatedData.name;
    const sex = updatedData.sex;
    const jobType = updatedData.jobType;
    const age = updatedData.age;
    const address = updatedData.address;
    const supervisor = updatedData.supervisor;
    const CCCD = updatedData.CCCD;
    const Salary = updatedData.salary;
    const email = updatedData.email;
    console.log([id, fname, age, sex, email, CCCD, address, supervisor, jobType, Salary]);

    try {
        if (supervisor != '') {
            await connection.query(
                `EXEC alter_employee ${id}, '${fname}', ${age}, '${sex}', '${email}', '${CCCD}', '${address}', ${supervisor}, '${jobType}', ${Salary}`
            );
        } else {
            await connection.query(
                `EXEC alter_employee ${id}, '${fname}', ${age}, '${sex}', '${email}', '${CCCD}', '${address}', ${null}, '${jobType}', ${Salary}`
            );
        }
    } catch (err) {
        console.error('Error updating employee:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function addEmployee(addInfo) {
    const fname = addInfo.name;
    const sex = addInfo.sex;
    const age = addInfo.age;
    const address = addInfo.address;
    const supervisor = addInfo.supervisor;
    const CCCD = addInfo.CCCD;
    const email = addInfo.email;
    const jobType = addInfo.jobType;
    const Salary = addInfo.salary;

    try {
        if (supervisor != '') {
            await connection.query(
                `EXEC add_employee '${fname}', ${age}, '${sex}', '${email}', '${CCCD}', '${address}', ${supervisor}, '${jobType}', ${Salary}`
            );
        } else {
            await connection.query(
                `EXEC add_employee '${fname}', ${age}, '${sex}', '${email}', '${CCCD}', '${address}', ${null}, '${jobType}', ${Salary}`
            );
        }
    } catch (err) {
        console.error('Error adding employee:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function getSchedule() {
    try {
        const Schedule = await connection.query(
            `SELECT fname, sched_id, start_hour, end_hour,start_date FROM shift INNER JOIN people ON people.id = shift.id`
        );
        console.log(Schedule['recordset']);
        return Schedule['recordset'];
    } catch (err) {
        console.error('Error fetching schedule:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function getPartTime() {
    try {
        const employees = await connection.query(
            'SELECT people.id, people.fname FROM people INNER JOIN part_time_emp ON people.id = part_time_emp.id'
        );
        return employees['recordset'];
    } catch (err) {
        console.error('Error fetching employees name:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function getScheduleByID(id) {
    try {
        const schedule = await connection.query(
            `SELECT sched_id, id, start_hour, end_hour, start_date FROM shift WHERE sched_id = ${id}`
        );
        return schedule['recordset'];
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function getScheduleOfEmployee(id) {
    try {
        const schedule = await connection.query(
            `SELECT sched_id, id, start_hour, end_hour, start_date FROM shift INNER JOIN employee ON employee.id = ${id} AND shift.id = employee.id` 
        );
        console.log(schedule['recordset']);
        return schedule['recordset'];
    } catch (err) {
        console.error('Error fetching schedule for employee by ID:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function editSchedule(id, employee, date, start, end) {
    try {
        await connection.query(
            `UPDATE shift SET id = ${employee}, start_hour = '${start.substring(0,8)}', end_hour = '${end.substring(0,8)}', start_date = '${date}' WHERE sched_id = ${id}`
        );
    } catch (err) { 
        console.error('Error editing schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function addSchedule(employee, date, start, end) {
    try {
        await connection.query(
            `INSERT INTO shift (id, start_hour, end_hour, start_date) VALUES (${employee}, '${start.substring(0,8)}', '${end.substring(0,8)}', '${date}')`
        );
    } catch (err) {
        console.error('Error adding schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function deleteEmployee(id) {
    try {
        await connection.query(
            `DELETE FROM employee WHERE id = ${id}`
        );
    } catch (err) {
        console.error('Error deleting employee:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function deleteShift(id) {
    try {
        await connection.query(
            `DELETE FROM shift WHERE sched_id = ${id}`
        );
    } catch (err) {
        console.error('Error deleting shift:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkSchedule(sched_id, id, start, end, date) {
    try {
        const check= await connection.query(
            `EXEC checkSchedule ${sched_id}, ${id}, '${start.substring(0,8)}', '${end.substring(0,8)}', '${date}'`
        );
        return check['recordset'].length === 0;
    } catch (err) {
        console.error('Error checking schedule:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkScheduleAlt(id, start, end, date) {
    try {
        const check = await connection.query(
            `EXEC checkScheduleAlt  ${id}, '${start.substring(0,8)}', '${end.substring(0,8)}', '${date}'`
        );
        return check['recordset'].length === 0;
    } catch (err) {
        console.error('Error checking schedule:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkCCCD(cccd, id) {
    try {
        const CCCD = await connection.query(
            `SELECT cccd FROM people INNER JOIN employee ON people.id = employee.id WHERE cccd = '${cccd}' AND people.id != ${id}`
        );
        return CCCD['recordset'].length === 0;  
    } catch (err) {
        console.error('Error checking CCCD:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkEmail(email, id) {
    try {
        const Emails = await connection.query(
            `SELECT email FROM people INNER JOIN employee ON people.id = employee.id WHERE email = '${email}' AND people.id != ${id}`
        );
        return Emails['recordset'].length === 0;
    } catch (err) {
        console.error('Error checking email:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

module.exports = {
    getInfo,
    getEmployeeByID,
    updateEmployee,
    getAllIDName,
    addEmployee,
    getPartTime,
    getSchedule,
    addSchedule,
    getScheduleByID,
    editSchedule,
    getScheduleOfEmployee,
    deleteEmployee,
    deleteShift,
    checkSchedule,
    checkScheduleAlt,
    checkCCCD,
    checkEmail
};
