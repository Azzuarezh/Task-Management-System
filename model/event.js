const mysql = require('mysql');
const bodyParser = require('body-parser');

var connectionProperties = require('../util/connection');
var dateparser = require('../util/dateparser');
const conn = mysql.createConnection(connectionProperties);



exports.getUserEventsToday = function(req, res){

    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'Something failed!' })
    }else{
        var userId = req.session.userId 
        var todayStartDatetime = dateparser.todayStartDatetime(); 
        var todayEndDatetime = dateparser.todayEndDatetime();

        console.log('userid :', userId);
        console.log('today start datetime : ', todayStartDatetime)
        console.log('today end datetime : ', todayEndDatetime)
        
        let sql = "select * from view_user_events where userid = ? and(`startDate` >= ? and    `endDate`<= ? )";
        let query = conn.query(sql, [userId,todayStartDatetime,todayEndDatetime],
        function(err,result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ error: 'Something failed!' })
            } 
            console.log(result)      
            res.send(result)       
        });  
    }
    
}