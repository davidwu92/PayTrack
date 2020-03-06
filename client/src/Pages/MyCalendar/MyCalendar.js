import React, { useState } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
// import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'
// import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './myCalendar.css';
import '../../app.css'

//FullCalendar Imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
//https://fullcalendar.io/docs#toc


const MyCalendar = () => {

  //Set up Page's Variables
  const [calendarState, setCalendarState] = useState({
    payments: [
      { title: 'EVENT ONE', date: '2020-03-05' },
      { title: 'EVENT TWO', date: '2020-03-07' }
    ]
  })

  const handleDateClick = (e) =>{
    console.log(e) //Gives me a fat object
  }
  
  return(
    <>
      <div className="container">
        <h1>My Calendar View</h1>
        <button>Create a Payment Schedule</button>
        <p>Here we see the calendar (monthly) that color-codes and displays all your upcoming scheduled payments.</p>
        
        <div className = "row">
        <FullCalendar 
          defaultView="dayGridMonth"
          header={{
            center: 'dayGridMonth,dayGridWeek,dayGridYear',
          }}
          plugins={[ dayGridPlugin, interactionPlugin ]}
          dateClick={handleDateClick}
          events={calendarState.payments}
        />
        </div>
      </div>
    </>
  )
}

export default MyCalendar