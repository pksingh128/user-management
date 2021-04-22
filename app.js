const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
//define port
const port = process.env.PORT || 5000;

//parsing middleware
//parse application/x-www-urlencoded//form parsing
app.use(bodyParser.urlencoded({extended: false}));

//Middleware for parsing json request
app.use(express.json());

//provide static files
app.use(express.static(path.join(__dirname,'public')));

//Templating Engine 
app.engine('hbs',exphbs({ extname: 'hbs'}));
app.set('view engine','hbs');

//connection pool
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_pass,
    database        : process.env.DB_NAME  
});
//connect to db
pool.getConnection((err,connection)=>{
    if(err) throw err;  //not connected
    console.log(`connected to db as id ${connection.threadId}`) //connecred to db
})

const routes = require('./server/routes/user')
app.use('',routes);


//listening to the port
app.listen(port, ()=>{
    console.log(`server is up and listen on port ${port}`);
})