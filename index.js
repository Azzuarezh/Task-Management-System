const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const connectionProperties = require('./util/connection')

//testing the model class js
const user = require('./model/user')

const app = express();
const handlebars = require('express-handlebars');
const session = require('express-session'); 


//connection configuration
const conn = mysql.createConnection(connectionProperties);
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set folder public as static folder for static file (resource)
app.use('/assets',express.static(__dirname + '/public'));


var hbs = handlebars.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'login',
  partialsDir: __dirname + '/views/partials/'
});
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine)

//set view engine



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: '2359',
  unset:'destroy'
}));

var sess;


 
//route for homepage
app.get('/',(req, res) => {
  console.log('session : ', req.session)
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      firstName:sess.firstName,
      lastName:sess.lastName,
      isLoggedIn: sess.isLoggedIn
    });
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }
    
});

app.get('/login',(req, res) => {
  res.render('layouts/login');
});



// this section is for user API
app.post('/login',user.signIn);
app.post('/logout',user.signOut);

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});