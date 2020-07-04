const mysql = require('mysql');
const bodyParser = require('body-parser');

var connectionProperties = require('../util/connection');
const conn = mysql.createConnection(connectionProperties);


exports.signIn = function(req, res){
var username=req.body.username;
var password=req.body.password;

let sql = "SELECT * FROM users WHERE username=? and password=?";
let query = conn.query(sql, [username,password],
    function(err,result){
        if(err) {
            console.error("ERROR DUDE!!!!! ",err.stack);
            res.status(500);
        }
        var loginstatus = 0;        
        if(result.length > 0 ){
            //set the session               
            req.session.userId = result[0].userId;
            req.session.username = result[0].username;
            req.session.firstName = result[0].firstName;
            req.session.lastName = result[0].lastName;
            req.session.isLoggedIn = true;
            req.session.fistTimeLogin =true;
            //delete the password so it won't be stored in session
            delete result[0].password
            loginstatus = 1
        }      
        res.send({'loginstatus':loginstatus})       
    });
}

exports.signUp = function(req, res){

}

exports.signOut = function(req, res, next){
    console.log('req session: ',req.session)
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            console.log('req.session after destroyed:', req.session)
            res.clearCookie('Session');
            res.redirect('/login');
        }
    });
}

exports.getUserDetail = function(req, res, next){

}

exports.updateUser = function(req, res, next){

}

exports.changePassword = function(req, res, next){

}