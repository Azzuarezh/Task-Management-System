/*
this is main functionallity javascript file for master.hbs layout
to do things in front end side with jquery (excluding login page)
*/
$(document).ready(function(){
    setTimeout(loadEvents(), 1);
    //to parse date to another type of data
    function getDateObject(dte){
      listOfDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      listOfMonth = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      dateOnly = new Date(dte).getDate();
      return {
        dt : dateOnly,
        day : listOfDay[new Date(dte).getDay()],
        month:listOfMonth[new Date(dte).getMonth()],
        hour:new Date(dte).getHours(),
        minutes:new Date(dte).getMinutes(),
        seconds:new Date(dte).getSeconds(),
        time: new Date(dte).getHours() +":"+new Date(dte).getMinutes() +":" + new Date(dte).getSeconds()
      }
    }

    //datepicker configuration
    $('.dt-picker').datepicker({
      format :'yyyy-mm-dd '
    });
    
    //modal event show function
    $('#modalEvent').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var userId = button.data('userId') // Extract info from data-* attributes
        var modal = $(this)
        var action =  button.data('action');
        modal.find('#btnSaveEvent').attr('data-action',action)
        console.log('action : ', action)
        modal.find('.modal-title').text( action + ' event');
        /* -- getting reminder data via ajax */
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
        if(action == 'add'){
            //clear input field
            modal.find('input').val('');
            modal.find('textArea').val('');
            //remove selected option in reminder dropdown and set to none
            
        }
        else{
          //this is for edit section
        } 
    })
    // end modal event show function
    
    //insert/update event
    $('#btnSaveEvent').on('click', function(){
        var evtAction = $(this).data('action');
        var formObject =$('#formEvent');
        console.log('act: ', evtAction)
        var EventObj = {
            title : formObject.find('#title').val(),
            description : formObject.find('#description').val(),
            location : formObject.find('#location').val(),
            recurring: formObject.find('#recurring').prop('checked'),
            alldays : formObject.find('#alldays').prop('checked'),
            reminderId : formObject.find('select#reminder').children("option:selected").val(),
            startDate : formObject.find('#startDate').val() +formObject.find('#startTime').val(),
            endDate : formObject.find('#endDate').val() + formObject.find('#endTime').val() 
        }
        console.log('form object: ', EventObj)
        
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
    })

    //end insert/edit event

    //remove event
    $('.remove-event').on('click',function(){
     alert('clicked')
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
      $.post('/updateUser').done(function(result){
        console.log('result: ',result)
          if(result.isLoggedOff){
            window.location.href = '/login?isLoggedOff=true'
          }
      })
    })


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
                if(evt.endDate && getDateObject(evt.startDate).time){
                  txtTime=txtTime + ' - ' + getDateObject(evt.startDate).time
                }

                itemTime ='<li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> '+ txtTime +'</li>';
                itemLocation ='<li class="list-inline-item"><i class="fa fa-location-arrow" aria-hidden="true"></i> ' + 
                evt.location+'</li>';
                itemEditAction ='<li class="list-inline-item">'+
                  '<i class="fa fa-edit" aria-hidden="true" data-user-id="'+evt.userId+'" '+
                  'data-action="edit" data-toggle="modal" data-target="#modalEvent"></i></li>';
                
                  itemRemoveAction = '<li class="list-inline-item remove-event">'+
                '<i class="fa fa-trash " aria-hidden="true" data-user-id="'+ evt.userId +'" data-event-id="'+ evt.eventId +'" ' +
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