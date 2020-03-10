//NO LONGER BEING USED AS COMPONENT; KEPT FOR REFERRENCE

import React, {useState} from 'react'
import '../../app.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
//SOURCE: https://fullcalendar.io/docs/react

const CalendarComponent = () => {
  
  const [componentState, setComponentState] = useState({
    payments: [ //FIRST PAYMENT INSTANCE
      // { id: 0,
      //   groupId: 'Car Insurance', //groups events to be dragged
      //   title: 'EVENT ONE', 
      //   date: '2020-03-05',
      //   allDay: true, 
      //   classNames: ['Insurance'],
      //   editable: true,
      //   backgroundColor: 'blue',
      //   borderColor: 'black',
      //   textColor: 'red',
      //   extendedProps: {
      //     amount: '$200',
      //     category: 'Family',
      //     paymentNotes: 'I hate this insurance and I need a new one.',
      //     url: 'www.google.com'
      //   }
      // },
      // {
      //   title: `Lil Jon's Piano Lessons`,
      //   groupId: 'pianoLessons', // recurrent events in this group move together
      //   daysOfWeek: [ '4' ],  //WEEKLY stuff ONLY.
      //   allDay: true, 
      //   classNames: ['Family'],
      //   endRecur: '2020-12-25' //no more piano lessons after Christmas.
      // },
    ]
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