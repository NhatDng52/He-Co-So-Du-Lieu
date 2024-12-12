const express = require('express');
const bodyParser = require('body-parser');
const TicketRoute = require('./routes/TicketRoute');
const app = express();
const port = 3000;
const db = require('./config/db')
const connectDB = require('./config/db')
// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mvcExample', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
// Use Routes
app.use('/tickets', TicketRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the Express MVC Example!');
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


