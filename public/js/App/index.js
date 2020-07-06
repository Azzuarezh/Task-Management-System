/*
this is main functionallity javascript file for master.hbs layout
to do things in front end side with jquery (excluding login page)
*/
$(document).ready(function(){

    setTimeout(loadEvents(), 1);
    //to parse date to another type of data
    function getDateObject(dte){
      return {
        year: moment(dte).format('YYYY'),
        dt : moment(dte).format('D'),
        day : moment(dte).format('dddd'),
        month:moment(dte).format('MMM'),
        monthInt:moment(dte).format('MM'),
        hour: moment(dte).format('hh'),
        minutes:moment(dte).format('mm'),
        seconds: moment(dte).format('ss'),
        time: moment(dte).format('hh:mm:ss'),
        fullDate : moment(dte).format('YYYY-MM-d')
      }
    }

    //datepicker configuration
    $('.dt-picker').datepicker({
      format :'yyyy-mm-dd '
    });

   //datatable configuration
  

 $('#btnSearch').on('click',function(){
  var condition ="";
   $('#resultTable').show();
   var qb = $('#builder-widgets').queryBuilder('getSQL')
   if(qb){
     condition= qb.sql;
   }else{
     condition="";
   }
   console.log('condition: ', condition)
   var dtTable =  $('#resultTable').DataTable({
    dom :'t',
    serverSide: true,
    "ajax": {
      "url": "/event/query",
      "type": "POST",
      data:function(d){
        d.condition = condition;
      }
    },
    "columns": [
      { "data": 'title' },
      { "data": "description" },
      { "data": "location" },
      { "data": "startDate" },
      { "data": "endDate" },
      { "data": "reminderDescription" }
    ],   
    destroy: true
  });
 })

    
    //modal event show function
    $('#modalEvent').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var eventId = button.data('eventId') // Extract info from data-* attributes
        var modal = $(this)
        var action =  button.data('action');
        modal.find('#btnSaveEvent').attr('data-action',action)
        console.log('action : ', action)
        modal.find('.modal-title').text( action + ' event');
        /* -- getting reminder data via ajax */
        if(action == 'add'){
            //clear input field
            modal.find('input').val('');
            modal.find('textArea').val('');
            //remove selected option in reminder dropdown and set to none      
        }
        else{
          //this is for edit section
          $.ajax({
            url:'/event/getEventById',
            type:'GET',
            data:{eventId:eventId}
          }).done(function(result){
             console.log(result) 
             modal.find('#eventId').val(result.title);
             modal.find('#title').val(result.title);
             modal.find('#description').val(result.description);
             modal.find('#location').val(result.location);
             modal.find('#startDate').val(getDateObject(result.startDate).fullDate);
             modal.find('#startTime').val(getDateObject(result.startDate).time);
             modal.find('#endDate').val(getDateObject(result.endDate).fullDate);
             modal.find('#endTime').val(getDateObject(result.endDate).time);             
          })
        }
        
        
        $.ajax({
          type:'GET',
          url:'/reminder/getReminderList'
        }).done(function(result){
          //iterate the reminder to dropdown remidner
          $.each(result, function(idx, reminder){
              opt = $('<option/>',{'value':reminder.reminderId}).text(reminder.timeToRemindDesc)
              modal.find('select#reminder').append(opt)
          })
        })
    })
    // end modal event show function



    
    //insert/update event
    $('#btnSaveEvent').on('click', function(){
        var evtAction = $(this).data('action');
        var formObject =$('#modalEvent').find('#formEvent');
        console.log('act: ', evtAction)
        var EventObj = {
            eventId: formObject.find('#eventId').val(),
            title : formObject.find('#title').val(),
            description : formObject.find('#description').val(),
            location : formObject.find('#location').val(),
            recurring: formObject.find('#recurring').children("option:selected"). val(),
            alldays : formObject.find('#alldays').prop('checked'),
            reminderId : formObject.find('select#reminder').children("option:selected").val(),
            startDate : formObject.find('#startDate').val() + " " +formObject.find('#startTime').val(),
            endDate : formObject.find('#endDate').val() + ' '+ formObject.find('#endTime').val() 
        }
        console.log('form object: ', EventObj)
        alert('s')
        
        if(evtAction =='add'){
          $.ajax({
            type:'POST',
            url:'/event/insertNewEvent',
            data: JSON.stringify(EventObj),
            contentType:"application/json; charset=utf-8",
            dataType:"json"
            })
            .done(function(result){
              console.log('response:',result)
                if(result.status = 1){
                  toastr["success"](result.message, "Success")
                }else{
                  toastr["error"](result.message, "Error")
                }
                $('#modalEvent').modal('hide')
                loadEvents() 
            })
        }  
        else{
          $.ajax({
            type:'POST',
            url:'/event/UpdateEvent',
            data: JSON.stringify(EventObj),
            contentType:"application/json; charset=utf-8",
            dataType:"json"
            })
            .done(function(result){
              console.log('response:',result)
                if(result.status = 1){
                  toastr["success"](result.message, "Success")
                }else{
                  toastr["error"](result.message, "Error")
                }
                $('#modalEvent').modal('hide')
                loadEvents() 
            })
        }      
    })
    //end insert/edit event

    $('#modalRemoveEvent').on('show.bs.modal', function(event){
      var button = $(event.relatedTarget) // Button that triggered the modal
        var eventId = button.data('eventId') // Extract info from data-* attributes
        console.log('evt id: ', eventId)
        var modal = $(this)
        modal.find('#btnRemoveEvent').data('eventId',eventId)
    })

    //remove event
    $('#btnRemoveEvent').on('click',function(){
      $.ajax({
        type:'POST',
        url:'/event/removeEvent',
        data: JSON.stringify({eventId: $(this).data('eventId')}),
        contentType:"application/json; charset=utf-8",
        dataType:"json"
        })
        .done(function(result){
          console.log('response:',result)
            if(result.status = 1){
              toastr["success"](result.message, "Success")
            }else{
              toastr["error"](result.message, "Error")
            }
            $('#modalRemoveEvent').modal('hide')
            loadEvents() 
        })
      
    })


    $('#btn-sign-out').on('click',function(){
      if(confirm('Are you sure want to log out?')){
        $.post('/logout').done(function(result){
          console.log('result: ',result)
            if(result.isLoggedOff){
              window.location.href = '/login?isLoggedOff=true'
            }
        })
      }
    })
    

    $('#btnUpdateUser').on('click',function(){
      
      var data = {
        username:$("#username").val(), 
        password:$("#pwd").val(),
        firstName:$('#firstName').val(),
        lastName:$('#lastName').val()
      }
      console.log('data:', data)
      alert('triggered!')
      if(data.username && data.password && data.firstName){
        if(data.password == $('#confirmPwd').val()){
            $.ajax({
            type:'POST',
            url:'/profile/updateUser',
            data: JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json"
            })
            .done(function(response){
                if(response.status == 1){ 
                    toastr["success"](response.message, "Success")           
                }
            }).fail(function(response){
                toastr["error"](response.responseJSON.message, "Update failed")
            })
        }
        else{
            toastr["error"]("Password and Confirm password did not match", "Update failed")
        }
    }
    else{
        toastr["error"]("Please fill the required field", "Register failed")
    }

    })


     // Fix for Bootstrap Datepicker
     $('#builder-widgets').on('afterUpdateRuleValue.queryBuilder', function(e, rule) {
      if (rule.filter.plugin === 'datepicker') {
        rule.$el.find('.rule-value-container input').datepicker('update');
      }
    });
    
    $('#builder-widgets').queryBuilder({         
      filters: [
        {id: 'title',label: 'Title',type: 'string'},
        {id: 'description',label: 'Description',type: 'string' },
        {id: 'startDate',label: 'Start Date',type: 'date',validation: {format: 'YYYY-MM-DD'},plugin: 'datepicker',
          plugin_config: {
            format: 'yyyy-mm-dd',
            todayBtn: 'linked',
            todayHighlight: true,
            autoclose: true
          }
        },
      {
        id: 'endDate',label: 'End Date',type: 'date',validation: {format: 'YYYY-MM-DD'},plugin: 'datepicker',
        plugin_config: {
          format: 'yyyy-mm-dd',
          todayBtn: 'linked',
          todayHighlight: true,
          autoclose: true
        }
      },
      {id: 'location', label: 'Location',type: 'string'}
      ]
    });


    function loadEvents(){
      //get the events
    $.ajax({url: "/event/getTodaysEvent",type:'POST'})
    .done(function(result) {
          console.log('events :', result);
          //clear first
          $("div#today-schedule").html('');
          //check whether we have today schedule
          
          if(result.length > 0){
              //loop through event
              divGroup =$( "<div/>", {"class": "btn-toolbar mb-2 mb-md-0"});
              divContainer = $( "<div/>", {"class": "container"});
              $.each(result, function( index, evt ) {
                
                divRowStriped = $( "<div/>", {"class": "row row-striped"});
                eventBanner =   $( "<div/>", {"class": "col-2 text-right"});
                
                headingDateDt = $('<h1/>',{"class":"display-4"});
                headingDateDt.append($('<span/>',{"class":"badge badge-secondary"}).text(getDateObject(evt.startDate).dt));
                headingDateMnth = $('<h2/>').html(getDateObject(evt.startDate).month);
  
                //put heading into event banner
                eventBanner.append(headingDateDt).append(headingDateMnth);
  
                divEventDetail = $('<div/>',{"class":"col-10"})
                headingEventTitle = $('<h3/>',{"class":"text-uppercase"});
                eventTitle = $('<strong/>').html(evt.title);
  
                //list event detail
                listEventDetail = $('<ul/>',{"class":"list-inline"});
  
                listItemTag = $('<li/>',{"class":"list-inline-item"});
                
                itemDay ='<li class="list-inline-item"><i class="fa fa-calendar-o" aria-hidden="true"></i> ' + 
                getDateObject(evt.startDate).day + ' </li>';
                
                txtTime = getDateObject(evt.startDate).time 
                if(evt.endDate && (getDateObject(evt.endDate).time != '00:00:00')){
                  console.log('end time : ' , getDateObject(evt.endDate).time)
                  txtTime=txtTime + ' - ' + getDateObject(evt.endDate).time
                }

                itemTime ='<li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> '+ txtTime +'</li>';
                itemLocation ='<li class="list-inline-item"><i class="fa fa-location-arrow" aria-hidden="true"></i> ' + 
                evt.location+'</li>';
                itemEditAction ='<li class="list-inline-item">'+
                  '<i class="fa fa-edit" aria-hidden="true" data-event-id="'+evt.eventId+'" '+
                  'data-action="edit" data-toggle="modal" data-target="#modalEvent"></i></li>';
                
                  itemRemoveAction = '<li class="list-inline-item remove-event">'+
                '<i class="fa fa-trash " aria-hidden="true" data-event-id="'+ evt.eventId +'" ' +
                'data-action="remove" data-toggle="modal" data-target="#modalRemoveEvent"></i></li>';
              
  
                

                $(listItemTag
                  .append(itemDay)
                  .append(itemTime)
                  .append(itemLocation)
                  .append(itemEditAction)
                  .append(itemRemoveAction)
                  )
                .appendTo(listEventDetail);
              
                eventDescription = $('<p/>').html(evt.description);
  
                headingEventTitle.append(eventTitle);
                divEventDetail.append(headingEventTitle).append(listEventDetail).append(eventDescription);
                divRowStriped.append(eventBanner).append(divEventDetail);
                divContainer.append(divRowStriped) 
              }); 
              divGroup.append(divContainer)
              $(divGroup).appendTo( "div#today-schedule");
  
          }
          else{
              //loop through event
              divGroup =$( "<div/>", {"class": "btn-toolbar mb-2 mb-md-0"});
              divContainer = $( "<div/>", {"class": "container"});
              divRowStriped = $( "<div/>", {"class": "row row-striped"});
              divRowStriped.append('<h5>You have no event today. '+
              'Enjoy your day <i class="fa fa-coffee" aria-hidden="true"></i></h5>')
              divContainer.append(divRowStriped);
              divGroup.append(divContainer)
              $(divGroup).appendTo( "div#today-schedule");

          }
  
  
      })
    }

    
  });