const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const connectionProperties = require('./util/connection')

//testing the model class js
const user = require('./model/user')
const evt = require('./model/event')

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
app.use('/assets',express.static(path.join(__dirname, "public")));


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

//this section is for views path

app.get('/login',(req, res) => {
  res.render('layouts/master', {
    layout:'master',
    firstName:sess.firstName,
    lastName:sess.lastName   
  });
});

app.get('/event',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      eventPage :true,
      greeting: req.query.greeting,
      firstName:sess.firstName,
      lastName:sess.lastName 
    });
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});


app.get('/calendar',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      calendarPage :true,
      firstName:sess.firstName,
      lastName:sess.lastName  
    });
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});

app.get('/profile',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      profilePage :true,
      firstName:sess.firstName,
      lastName:sess.lastName  
    });
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});




// this section for ajax api path (event, user, calendar which call via Ajax)
app.post('/login',user.signIn);
app.post('/logout',user.signOut);

app.post('/event/getTodaysEvent',  evt.getUserEventsToday);



//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});