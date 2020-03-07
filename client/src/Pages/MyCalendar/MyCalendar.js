import React, { useState } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
// import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'
// import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './myCalendar.css';
import '../../App.css'

//FullCalendar Imports
import FullCalendar, {eventClickInfo} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
//https://fullcalendar.io/docs#toc


const MyCalendar = () => {

  //Set up Page's Variables
  const [calendarState, setCalendarState] = useState({
    // EVENT OBJECTS to throw into calendar. "All properties are read-only, use methods to modify."
    //https://fullcalendar.io/docs/event-object
    payments: [
      //FIRST PAYMENT INSTANCE
      { id: 0,
        groupId: 'Car Insurance', //groups payments to be dragged
        title: 'EVENT ONE', 
        date: '2020-03-05',
        allDay: true, 
        // url: 'www.google.com',  this sends user to google upon clicking event.
        classNames: ['Insurance'],
        editable: true,
        backgroundColor: 'blue',
        borderColor: 'black',
        textColor: 'red',
        extendedProps: {
          amountDue: '$200',
          paymentNotes: 'Notes to self: I hate this insurance and I need a new one.',
          url: 'www.google.com'
        }
      },
      { id: 1,
        title: 'EVENT TWO',
        date: '2020-03-07'
      },
      {
        title: `Lil Jon's Piano Lessons`,
        groupId: 'pianoLessons', // recurrent events in this group move together
        daysOfWeek: [ '4' ], 
        allDay: true, 
        classNames: ['Family'],
        endRecur: '2020-12-25' //no more piano lessons after Christmas?
      },
    ],
    tagColors: [{insurance: "blue"}, {family: "orange"}, {house: "purple"}, {income: "green"}],
  })

  const handleDateClick = (e) =>{
    console.log(e) //Gives me a fat object
  }
  
  const handleEventClick = (e) => {
    console.log(e)
    console.log(e.event.extendedProps)
    //gives {event, el (html element), jsEvent (click info), view (current view object)}
    //Ideally triggers a viewing/editing modal.
  }

  return(
    <>
      <div className="container">
        {/* PAGE HEADER */}
        <h3 className = 'center'>Upcoming Payments</h3>
        <div className = "row"> 
          <div className = "col s6 m6 l6 center">
            {/* MODAL with New Payment Form */}
            <button>Add a new payment</button>
          </div>
          <div className = "col s6 m6 l6 center">
            {/* TAKE ME TO YEAR-VIEW? */}
            <button>Go to Annual View</button>
          </div>
        </div>
        
        {/* CALENDAR CUSTOMIZATION */}
        <div className="row">
          <p>Change the colors of events that have certain tags.</p>
          {calendarState.tagColors.map(tag => (
            <>
              {tag[0]}
            </>
          ))}
        </div>
        
        {/* CALENDAR STUFF (contained in div.row) */}
        <div className = "row">
          <FullCalendar 
            defaultView="dayGridMonth"
            header={{
              center: 'dayGridMonth,dayGridWeek',
            }}
            droppable= {true} //lets me drag and drop events.
            plugins={[ dayGridPlugin, interactionPlugin ]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={calendarState.payments} //array of events rendered on calendar.
          />
        </div>
        
      </div> {/* END CONTAINER */}
    </>
  )
}

export default MyCalendar