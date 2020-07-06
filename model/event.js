const mysql = require('mysql');
const bodyParser = require('body-parser');

var connectionProperties = require('../util/connection');
var dateparser = require('../util/dateparser');
const conn = mysql.createConnection(connectionProperties);



exports.getUserEventsToday = function(req, res){

    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        var userId = req.session.userId 
        var todayStartDatetime = dateparser.todayStartDatetime(); 
        var todayEndDatetime = dateparser.todayEndDatetime();
        
        let sql = "select * from view_user_events where userid = ? and(`startDate` >= ? and    `endDate`<= ? ) order by `startDate` asc";
        let query = conn.query(sql, [userId,todayStartDatetime,todayEndDatetime],
        function(err,result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ error: 'Something failed!'})
            }     
            res.send(result)       
        });  
    }
    
}

exports.eventQuery = function(req, res){
    console.log('req:', req)
    console.log('req.body :', req.body)
    /*if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{*/
        
        var userId = req.session.userId;
 
        var condition = req.body.condition;
        let sql = "select * from view_user_events where userid = ?";
        
        if(condition && condition !=''){
            sql+=' and('+condition+')';
            
        }
        
        console.log('sql : ', sql)
        let query = conn.query(sql, [userId],
        function(err,result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ error: 'Something failed!'})
            } 
            console.log('search result :' ,result)      
            res.send({"data":result,"draw": 1,"recordsTotal": result.length})       
        });  
    /*}*/ 
}

exports.getEventById = function(req,res){
    console.log('req.params :', req.params, ' req.body', req.body, 'req.query', req.query)
    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        var userId = req.session.userId 
        var eventId = req.query.eventId

        console.log('eventid', eventId)

        let sql = "select * from events where eventId =?";
        let query = conn.query(sql, [eventId],
        function(err,result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ error: 'Something failed!'})
            } 
            if(result.length = 1){
                res.send(result[0])
            }      
                   
        });  
    }
}

exports.insertNewEvent = function(req, res){
    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        var userId = req.session.userId 

        var event = req.body

        console.log('event object from request:', event)

        let InsertEventSql = "insert into events(title,description,location,recurring,allDay,startDate,endDate,reminderId)"+
        "values(?,?,?,?,?,?,?,?)";
        let eventId =0;
        let insertEventQuery = conn.query(InsertEventSql, 
            [   event.title,
                event.description,
                event.location,
                (event.recurring)?event.recurring:null,
                (event.alldays)?event.alldays:0,
                event.startDate,
                event.endDate, 
                (event.reminderId)?event.reminderId:null],
        function(err, result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ message: 'Something failed!', status:0})
            }
            else{
                eventId = result.insertId
                console.log('generated event id: ', eventId)
                //insert into table user event
                let InsertUserEventSql="insert into user_events(eventid,userid)values(?,?)";
                let insertUserEventQuery = conn.query(InsertUserEventSql,[eventId,userId],
                    function(err, result){
                        if(err){
                            console.error("ERR! : ",err.stack);
                            res.status(500).send({ message: 'Something failed!', status:0})
                        }else{
                            res.status(200).send({status:1, message:"Event Successfully Added"})
                        }  
                    })
            }
                    
        });   
    }
}

exports.updateEvent = function(req, res){
    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        var userId = req.session.userId 
        var eventId = req.body.eventId
        var event = req.body
        let UpdateEventSql = "Update events SET title=?, description=?, location=?, recurring=?, allDay=? , startDate=?, endDate=?,reminderId=? "+
        "where eventId =?";
        
        let UpdateEventQuery = conn.query(UpdateEventSql, 
            [eventId],
        function(err, result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ message: 'Something failed!', status:0})
            }
            else{
               //delete insert
                let RemoveUserEventSql="DELETE FROM user_events where eventId =?";
                let RemoveUserEventQuery = conn.query(RemoveUserEventSql,[eventId],
                    function(err, result){
                        if(err){
                            console.error("ERR! : ",err.stack);
                            res.status(500).send({ message: 'Something failed!', status:0})
                        }else{
                            let insertUserEventQuery = conn.query(InsertUserEventSql,[eventId,userId],
                                function(err, result){
                                    if(err){
                                        console.error("ERR! : ",err.stack);
                                        res.status(500).send({ message: 'Something failed!', status:0})
                                    }else{
                                        res.status(200).send({status:1, message:"Event Successfully Updated"})
                                    }  
                                })
                        }  
                    })
            }
                    
        });   
    }
    
}

exports.removeEvent = function(req, res){
    
    if(typeof(req.session.userId) == 'undefined'){        
        console.error("there is no user id in session. please login to see the event");
        res.status(500).send({ error: 'There is no user id in session. please login to see the event' })
    }else{
        eventId = req.body.eventId
        let RemoveEventSql = "DELETE  FROM events WHERE eventId =?";
        
        let RemoveEventQuery = conn.query(RemoveEventSql, 
            [ eventId],
        function(err, result){
            if(err) {
                console.error("ERR! : ",err.stack);
                res.status(500).send({ message: 'Something failed!', status:0})
            }
            else{
               
                let RemoveUserEventSql="DELETE FROM user_events where eventId =?";
                let RemoveUserEventQuery = conn.query(RemoveUserEventSql,[eventId],
                    function(err, result){
                        if(err){
                            console.error("ERR! : ",err.stack);
                            res.status(500).send({ message: 'Something failed!', status:0})
                        }else{
                            res.status(200).send({status:1, message:"Event Successfully Removed"})
                        }  
                    })
            }
                    
        });   
    }
}