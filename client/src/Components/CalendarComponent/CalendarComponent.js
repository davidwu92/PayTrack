import React, {useState} from 'react'
import '../../App.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
//SOURCE: https://fullcalendar.io/docs/react

const CalendarComponent = () => {
  
  const [componentState, setComponentState] = useState({
    payments: []
  })

  const handleDateClick = (e) =>{
    console.log(e) //Gives me a fat object

  }

  return (
    <FullCalendar 
      defaultView="dayGridMonth" 
      plugins={[ dayGridPlugin, interactionPlugin ]}
      dateClick={handleDateClick}
      events={[
        { title: 'EVENT ONE', date: '2020-03-05' },
        { title: 'EVENT TWO', date: '2020-03-07' }
      ]}
    />
  )
}

export default CalendarComponent