const sql = require('mssql');

// Create a connection configuration for the MS SQL database
const config = {       
    server: 'DESKTOP-0HD1B0H', // SQL Server host
    user: 'tam',
    password: '123',
    database: 'Employee',
    options: {
        trustServerCertificate: true, // Change to false if you have a valid certificate
        enableArithAbort: true
    }
};

// Connect to the database
async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Connected to the MS SQL database!');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

// Fetch data from the 'people' table
async function fetchData() {
    try {
        const result = await sql.query('SELECT * FROM people');
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

// Example usage
connectToDatabase()
    .then(() => fetchData())
    .catch((err) => console.error('Error:', err));

module.exports = sql;
