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
    checkScheduleAlt,
    checkCCCD,
    checkEmail
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

function validE(e) {
    const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patt.test(e);
}
  
// Function to remove zero padding and add AM/PM
function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getUTCHours(); // Use UTC to get the correct hour
    const minutes = date.getUTCMinutes(); // Use UTC minutes
    const ampm = hours >= 12 ? 'PM' : 'AM'; // AM/PM determination

    hours = hours % 12; // Convert 24-hour to 12-hour
    hours = hours ? hours : 12; // Handle 0 hour as 12 (midnight or noon)

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`; // Format 'h:mm AM/PM'
}


// Display Employee List
app.get('/employees', async (req, res) => {
    try {
        employees = await getInfo();
        res.render('employees', { employees });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Internal Server Error');
    }
});
// Display Add Employee Form
app.get('/employees/add', async (req, res) => {
    const supervisors = await getAllIDName();
    res.render('addEmployee', { supervisors, errorMessage : null });
});

// Handle Add Employee Form Submission
app.post('/employees/add', async (req, res) => {
    const addInfo = req.body;
    const cCCCD = await checkCCCD(addInfo.CCCD, -1);
    const cEmail = await checkEmail(addInfo.email, -1);
    const supervisors = await getAllIDName();
    if (!validE(addInfo.email)) {
        res.render('addEmployee', {supervisors, errorMessage : "Địa chỉ email không đúng!"})
        return;
    }
    if (cEmail && cCCCD) {
        await addEmployee(addInfo)
        res.redirect('/employees');
        return;
    } else if (!cCCCD) {
        res.render('addEmployee', {supervisors, errorMessage : "CCCD bị trùng!"})
        return;
    } else {
        res.render('addEmployee', {supervisors, errorMessage : "Email bị trùng!"})
        return;
    }
}); 

app.get('/employees/edit/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Fetch employee details from database or data source
    const [employee] = await getEmployeeByID(employeeId);
    const supervisors = await getAllIDName();
    if (employee) {
        res.render('editEmployee', { employee, supervisors, errorMessage : null});
    } else {
        res.status(404).send('Employee not found');
    }
});

app.post('/employees/update/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Logic to update employee in database with data from req.body
    const updatedData = req.body;
    const cCCCD = await checkCCCD(updatedData.CCCD, employeeId);
    const cEmail = await checkEmail(updatedData.email, employeeId);
    const supervisors = await getAllIDName();
    const [employee] = await getEmployeeByID(employeeId);
    if (!validE(updatedData.email))  {
        res.render('editEmployee', {supervisors, employee, errorMessage : "Địa chỉ email không đúng!"})
        return;
    }
    console.log(updatedData);
    if (cEmail && cCCCD) {
        await updateEmployee(employeeId, updatedData);
        console.log(`Update employee ${employeeId} with data:`, updatedData);
        res.redirect('/employees');
        return
    } else if (!cCCCD) {
        res.render('editEmployee', {supervisors, employee, errorMessage : "CCCD bị trùng!"})
        return;
    } else {
        res.render('editEmployee', {supervisors, employee, errorMessage : "Email bị trùng!"})
        return;
    }
});

app.post('/employees/delete/:id', async (req, res) => {
    const employeeId = req.params.id;
    // Logic to update employee in database with data from req.body
    deleteEmployee(employeeId);
    res.redirect('/employees');
});

app.get('/schedule', async (req, res) => {
    const schedules = await getSchedule();
    schedules.forEach(item => {
        item.start_hour = formatTime(item.start_hour)
        item.end_hour = formatTime(item.end_hour)
    })
    res.render('schedule', { schedules });
});

app.get('/schedule/edit/:id', async (req, res) => {
    const scheduleId = req.params.id;
    // Fetch schedule details by ID from database
    const [schedule] = await getScheduleByID(scheduleId);
    const employees = await getPartTime();
    console.log(schedule);
    console.log(schedule.id);
    const [employee] = await getEmployeeByID(schedule.id)
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
        const [employee] = await getEmployeeByID(employeeid);
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