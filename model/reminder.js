const mysql = require('mysql');
const bodyParser = require('body-parser');

var connectionProperties = require('../util/connection');
var dateparser = require('../util/dateparser');
const conn = mysql.createConnection(connectionProperties);


exports.getReminderList = function(req,res){
    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        let sql = "select * from reminder";
        let query = conn.query(sql,
        function(err,result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ error: 'Something failed!'})
            } 
            console.log(result)      
            res.send(result)       
        });  
    }
}