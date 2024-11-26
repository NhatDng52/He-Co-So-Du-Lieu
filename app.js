const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const mysql = require('mysql')   // database chay o local
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // mat khau dung vao
  database: '',   // ten database
})

connection.connect()

connection.query('SELECT * from test', (err, rows, fields) => {    // cau len test
  if (err) throw err

  console.log('The solution is: ', rows)
})

connection.end()




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})