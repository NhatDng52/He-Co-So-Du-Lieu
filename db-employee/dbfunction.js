const connection = require('./db');

async function getInfo() {
     try {
        const [employees] = await connection.promise().query('CALL show_info()');
        employees.sort((a, b) => a.id - b.id);
        return employees;
    } catch (err) {
        console.error('Error fetching employees:', err);
        throw err; // Rethrow the error if there's a problem
    } 

} 

async function getEmployeeByID(id) {
    try {
        const [employee] = await connection.promise().query(`Call getEmployeeByID(?)`, id);
        return employee;
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function getAllIDName() {
    try {
        const [employees] = await connection.promise().query(
            'SELECT people.id, people.fname FROM people, employee WHERE people.id = employee.id'
        );
        return employees;
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
    const supervisor= updatedData.supervisor;
    const CCCD = updatedData.CCCD;
    const Salary = updatedData.salary;
    const email = updatedData.email;
    console.log([id, fname, age, sex, email, CCCD, address, supervisor, jobType, Salary])

    try {
        if (supervisor != '') {
            await connection.promise().query(
                'CALL alter_employee(?,?,?,?,?,?,?,?,?,?)', [id, fname, age, sex, email, CCCD, address, supervisor, jobType, Salary]
            );
        } else {
            await connection.promise().query(
                'CALL alter_employee(?,?,?,?,?,?,?,?,?,?)', [id, fname, age, sex, email, CCCD, address, null, jobType, Salary]
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
            await connection.promise().query(
                'CALL add_employee(?,?, ?, ?, ?, ?, ?,?,?)', [fname, age, sex, email, CCCD, address, supervisor, jobType, Salary]
            );
        } else {
            await connection.promise().query(
                'CALL add_employee(?,?, ?, ?, ?, ?, ?,?,?)', [fname, age, sex, email, CCCD, address, null, jobType, Salary]
            );
        }
    } catch (err) {
        console.error('Error updating employee:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function getSchedule() {
    try {
        const [Schedule] = await connection.promise().query(
            'SELECT fname, sched_id, start_hour, end_hour, start_date FROM shift, people WHERE people.id = shift.id'
        );
        return Schedule;
    } catch (err) {
        console.error('Error fetching schedule:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function getPartTime() {
    try {
        const [employees] = await connection.promise().query(
            'SELECT people.id, people.fname FROM people, part_time_emp WHERE people.id = part_time_emp.id'
        );
        return employees;
    } catch (err) {
        console.error('Error fetching employees name:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function getScheduleByID(id) {
        try {
            const [schedule] = await connection.promise().query(
                `SELECT sched_id, id, start_hour, end_hour, start_date FROM shift WHERE sched_id = ?`, [id]
            );
            return schedule;
        } catch (err) {
            console.error('Error fetching employee by ID:', err);
            throw err; // Rethrow the error if there's a problem
        }
}

async function getScheduleOfEmployee(id) {
    try {
        const [schedule] = await connection.promise().query(
            `SELECT sched_id, id, start_hour, end_hour, start_date FROM shift, employee WHERE employee.id = ? AND shift.id = employee.id`, [id]
        );
        return schedule;
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        throw err; // Rethrow the error if there's a problem
    }
}

async function editSchedule(id, employee, date, start, end) {
    try {
        await connection.promise().query(
            'UPDATE shift SET id = ?, start_hour = ?, end_hour = ?, start_date = ? WHERE sched_id =?', [employee, start, end, date, id]
        );
    } catch (err) {
        console.error('Error adding schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function addSchedule(employee, date, start, end) {
    try {
        await connection.promise().query(
            'INSERT INTO shift(id, start_hour, end_hour, start_date) VALUES (?,?,?,?)', [employee, start, end, date]
        );
    } catch (err) {
        console.error('Error adding schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function deleteEmployee(id) {
    try {
        await connection.promise().query(
            'DELETE FROM employee WHERE employee.id = ?', [id]
        );
    } catch (err) {
        console.error('Error deleting employee:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function deleteShift(id) {
    try {
        await connection.promise().query(
            'DELETE FROM shift WHERE shift.sched_id = ?', [id]
        );
    } catch (err) {
        console.error('Error deleting schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkSchedule(sched_id, id, start, end, date) {
    try {
        const [[check]] = await connection.promise().query(
            'Call checkSchedule(?, ?, ?, ?, ?)',
            [sched_id, id, start, end, date]
        );
        return check.length == 0;
    } catch (err) {
        console.error('Error deleting schedules:', err);
        throw err; // Rethrow the error if there's a problem
    } 
}

async function checkScheduleAlt(id, start, end, date) {
    try {
        const [[check]] = await connection.promise().query(
            'Call checkScheduleAlt(?, ?, ?, ?)',
            [id, start, end, date]
        );
        console.log([id, start, end, date])
        console.log("check")
        console.log(check)
        console.log("[check]")
        console.log([check])
        console.log(check.length);
        return check.length == 0;
    } catch (err) {
        console.error('Error deleting schedules:', err);
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
    checkScheduleAlt
};

