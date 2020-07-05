const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const connectionProperties = require('./util/connection')

// the model class js
const user = require('./model/user')
const evt = require('./model/event')
const reminder = require('./model/reminder')


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
  console.log(req.query)
  console.log('isLoggedOff?', req.query.isLoggedOff)
  res.render('layouts/login', {
    layout:'login',
    isLoggedOff:req.query.isLoggedOff
  });
});


app.get('/signup',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.redirect('/event')
  }else{
    //if no login session then we can sign up
    res.render('layouts/signup', {
      layout:'signup'
    });
  } 
  


  
});


app.get('/',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.redirect('/event')
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});


app.get('/event',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      pageTitle:'Events',
      eventPage :true,
      greeting: req.query.greeting,
      firstName:sess.firstName,
      lastName:sess.lastName,
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
      pageTitle:'Calendar',
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
      pageTitle:'Profile',
      profilePage :true,
      firstName:sess.firstName,
      lastName:sess.lastName,
      username:sess.username  
    });``
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});


app.get('/search',(req, res) => {
  sess = req.session;
  //check session whether it has already logged in
  if(sess.isLoggedIn){
    res.render('layouts/master', 
    {
      layout:'master',
      pageTitle:'Search',
      searchPage :true 
    });
  }else{
    //if no login session then redirect to login page
    res.redirect('/login')
  }    
});




// this section for ajax api path (event, user, calendar which call via Ajax)
app.post('/login',user.signIn);
app.post('/logout',user.signOut);
app.post('/signup', user.signUp);

//this section for ajax api event
app.post('/event/getTodaysEvent',  evt.getUserEventsToday);
app.post('/event/getEventById',evt.getEventById)

app.post('/event/insertNewEvent',evt.insertNewEvent)
app.post('/event/removeEvent', evt.removeEvent)

app.get('/reminder/getReminderList', reminder.getReminderList)


//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});