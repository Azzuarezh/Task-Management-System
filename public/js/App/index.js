/*
this is main functionallity javascript file for master.hbs layout
to do things in front end side with jquery (excluding login page)
*/
$(document).ready(function(){
    
    //to parse date to another type of data
    function getDateObject(dte){
      listOfDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      listOfMonth = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      dateOnly = new Date(dte).getDate();
      return {
        dt : dateOnly,
        day : listOfDay[new Date(dte).getDay()],
        month:listOfMonth[new Date(dte).getMonth()]
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
            reminderId : formObject.find('select#reminder').children("option:selected").val()
        }
        console.log('form object: ', EventObj)
    })



    //get the events
    $.ajax({url: "/event/getTodaysEvent",type:'POST'})
    .done(function(result) {
          console.log('events :', result);
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
                itemTime ='<li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> '+ 
                '12:30 PM - 2:00 PM</li>';
                itemLocation ='<li class="list-inline-item"><i class="fa fa-location-arrow" aria-hidden="true"></i> ' + 
                evt.location+'</li>';
                itemEditAction ='<li class="list-inline-item">'+
                  '<a href="#" data-user-id="'+evt.userId+'" data-action="edit" data-toggle="modal" data-target="#modalEvent"><i class="fa fa-edit" aria-hidden="true"></i> edit event</a></li>';
  
              
  
                $(listItemTag
                  .append(itemDay)
                  .append(itemTime)
                  .append(itemLocation)
                  .append(itemEditAction))
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
  
  
    })
  });