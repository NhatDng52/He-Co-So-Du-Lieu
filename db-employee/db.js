const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'employee'
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});

// Connect and fetch data
connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database!');

/*     connection.query('SELECT * FROM people', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return;
        }
        console.log('People:', results);

        // Close the connection
    }); */
});

module.exports = connection