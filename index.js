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
const redis = require('redis')
const session = require('express-session'); 
const redisStore = require('connect-redis')(session);


//connection configuration
const conn = mysql.createConnection(connectionProperties);
 
//test connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set folder public as static folder for static file (resource)
app.use('/assets',express.static(__dirname + '/public'));


var hbs = handlebars.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'master',
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
  store: new redisStore({ client : redis.createClient()}),
  unset:'destroy'
}));




 
//route for homepage
app.get('/',(req, res) => {
  console.log('session : ', req.session)
  if(req.session.userId && req.session.username){
    res.render('layouts/master');
  }else{
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