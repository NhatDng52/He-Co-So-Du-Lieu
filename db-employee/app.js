const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const {
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
} = require('./dbfunction.js');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from the public directory
/* app.use(express.static('public'));
const employees = [
    { id: 1, name: 'John Doe', age: 30, address: '123 Main St', supervisorName: 'Jane Smith' },
    { id: 2, name: 'Alice Johnson', age: 25, address: '456 Oak St', supervisorName: 'Mike Brown' }
];
 */
// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Display Employee List
app.get('/employees', async (req, res) => {
    try {
        [employees] = await getInfo();
        res.render('employees', { employees });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Internal Server Error');
    }
});
// Display Add Employee Form
app.get('/employees/add', async (req, res) => {
    const supervisors = await getAllIDName();
    res.render('addEmployee', { supervisors });
});
// Handle Add Employee Form Submission
app.post('/employees/add', async (req, res) => {
    const addInfo = req.body;
    await addEmployee(addInfo)
    res.redirect('/employees');
}); 

app.get('/employees/edit/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Fetch employee details from database or data source
    const [[employee]] = await getEmployeeByID(employeeId);
    const supervisors = await getAllIDName();
    console.log(supervisors)
    console.log(employee)
    if (employee) {
        res.render('editEmployee', { employee, supervisors});
    } else {
        res.status(404).send('Employee not found');
    }
});

app.post('/employees/update/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Logic to update employee in database with data from req.body
    const updatedData = req.body;
    console.log(updatedData);
    await updateEmployee(employeeId, updatedData);
    console.log(`Update employee ${employeeId} with data:`, updatedData);
    res.redirect('/employees');
});

app.post('/employees/delete/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Logic to update employee in database with data from req.body
    deleteEmployee(employeeId);
    res.redirect('/employees');
});

app.get('/schedule', async (req, res) => {
    const schedules = await getSchedule();
    res.render('schedule', { schedules });
});

app.get('/schedule/edit/:id', async (req, res) => {
    const scheduleId = req.params.id;
    // Fetch schedule details by ID from database
    const [schedule] = await getScheduleByID(scheduleId);
    const employees = await getPartTime();
    console.log(schedule);
    console.log(schedule.id);
    const [[employee]] = await getEmployeeByID(schedule.id)
    if (schedule) {
        console.log(schedule);
        res.render('editSchedule', {employee, employees, schedule , errorMessage : null});
    } else {
        res.status(404).send('Schedule not found');
    }
});

app.post('/schedule/delete/:id', async (req, res) => {
    const scheduleId = req.params.id;
    // Logic to delete schedule by ID from database
    //schedules = schedules.filter(s => s.id !== parseInt(scheduleId));
    await deleteShift(scheduleId);
    res.redirect('/schedule');
});

app.post('/schedule/update/:id', async (req, res) => {
    const scheduleId = req.params.id;
    const { employeeid, date, start, end } = req.body;
    const [schedule] = await getScheduleByID(scheduleId);
    const check = await checkSchedule(scheduleId, employeeid, start, end, date);
    if (check) {
        await editSchedule(scheduleId, employeeid, date, start, end);
        res.redirect('/schedule');
    }
    else {
        const [[employee]] = await getEmployeeByID(employeeid);
        const employees = await getPartTime();
        res.render('editSchedule', {employee, employees, schedule, errorMessage: "Nhân viên đã làm có ca làm vào thời gian này!" });
    }
});

app.get('/schedule/add', async (req, res) => {
    const employees = await getPartTime();  // Get list of employees from database
    res.render('addSchedule', { employees, errorMessage : null });
});

app.post('/schedule/add', async (req, res) => {
    const { employee, date, start, end } = req.body;
    const employees = await getPartTime();
    const check = await checkScheduleAlt(employee, start, end, date);
    if (check) {
        console.log("check")
        console.log(check)
        await addSchedule(employee, date, start, end);
        res.redirect('/schedule');
    }
    else {
        res.render('addSchedule', { employees , errorMessage: "Nhân viên đã làm có ca làm vào thời gian này!" });
    }
    // Redirect to the schedule listing page
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});