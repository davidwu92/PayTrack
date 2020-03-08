import React, { useState } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'
// import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './myCalendar.css';

import {
  Modal,
  Button,
  DatePicker,
} from 'react-materialize'

//FullCalendar Imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
//https://fullcalendar.io/docs#toc


const { addEvent } = UserAPI

const MyCalendar = () => {
//~~~~~~~~~~~~~~~~~~~~~~~~~CALENDAR VARIABLES/FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [calendarState, setCalendarState] = useState({
    // EVENT OBJECTS to throw into calendar. "All properties are read-only, use methods to modify."
    //https://fullcalendar.io/docs/event-object
    events: [
        //FIRST PAYMENT INSTANCE
        { id: 0,
          groupId: 'Car Insurance', //groups events to be dragged
          title: 'EVENT ONE', 
          date: '2020-03-05',
          allDay: true, 
          classNames: ['Insurance'],
          editable: true,
          backgroundColor: 'blue',
          borderColor: 'black',
          textColor: 'red',
          extendedProps: {
            amount: '$200',
            tags: ["Family", "Insurance"],
            paymentNotes: 'I hate this insurance and I need a new one.',
            url: 'www.google.com'
          }
        },
        {
          title: `Lil Jon's Piano Lessons`,
          groupId: 'pianoLessons', // recurrent events in this group move together
          daysOfWeek: [ '4' ],  //WEEKLY stuff ONLY.
          allDay: true, 
          classNames: ['Family'],
          endRecur: '2020-12-25' //no more piano lessons after Christmas.
        },
    ],
    tagColors: [{insurance: "blue"}, {family: "orange"}, {house: "purple"}, {income: "green"}],
  })

  const handleDateClick = (e) =>{
    console.log(e) //Gives me a fat object
    console.log(e.date)
  }
  
  const handleEventClick = (e) => {
    console.log(e)
    console.log(e.event.extendedProps)
    //gives {event, el (html element), jsEvent (click info), view (current view object)}
    //Ideally triggers a viewing/editing modal.
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~NEW PAYMENT VARIABLES/FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [newEventState, setNewEventState] = useState( {
    title: '',
    amount: 0,
    isPayment: true,
    frequency: 'once',
    url: '',
    category: '',
    notes: '',
  })
  newEventState.handleInputChange = (event) => {
    setNewEventState({ ...newEventState, [event.target.name]: event.target.value })
  }
  // Variables to handle new event Date
  const [dateState, setDateState] = useState({
    startDate: '',
    endDate: '',
  })
  dateState.handleDatePick = (date) => setDateState({...dateState, startDate: date})
  dateState.handleEndDate = (date) => setDateState({...dateState, endDate: date})

  //Button that triggers modal.
  const createEvent = <Button id="newPayment" className="purple white-text waves-effect waves-light center-align black-text">
    Add Payment or Income Event</Button>;
  
  //modal: payment vs income switch
  const switchFunction = () => setNewEventState({...newEventState, isPayment: !document.getElementById('paymentOrIncome').checked})
  
  //modal: frequency selection
  const frequencySelect = () => setNewEventState({...newEventState, frequency: document.getElementById('frequencySelect').value})
  
  //modal: endDatePicker row (shows up if frequency is anything but "once".)
  const endDatePicker = newEventState.frequency ==='once' ? null
    : 
      <div className="row">
        <div className="col s5 m2 l2">
          <p className="center">End date? (10 years from start date by default)</p>
        </div>
        <div className="col s7 m10 l10">
          <DatePicker
            placeholder="Select End Date"
            className="datePicker"
            options={{
              autoClose: false,    container: null,    defaultDate: null,    disableDayFn: null,
              disableWeekends: false,    events: [],    firstDay: 0,    format: 'mmm dd, yyyy',
              i18n: {cancel: 'Cancel',clear: 'Clear',done: 'Ok',
                months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
                monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                nextMonth: '›',
                previousMonth: '‹',
                weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                weekdaysAbbrev: ['S','M','T','W','T','F','S'],
                weekdaysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
              },
              isRTL: false,maxDate: null,minDate: new Date(),onClose: null,onDraw: null,onOpen: null,onSelect: null,
              parse: null,setDefaultDate: false,showClearBtn: false,showDaysInNextAndPreviousMonths: true,showMonthAfterYear: false,
              yearRange: 10
            }}
            onChange={dateState.handleEndDate}
          />
        </div>
      </div>

  //modal: category name to attach to event
  const categorySelect = () => setNewEventState({...newEventState, category: document.getElementById('categorySelect').value})

  //modal: hitting "Close" (reset newEventState)
  const cancelEvent = () => setNewEventState({title: '',amount: 0,isPayment: true, frequency: 'once',url:'',category:'', notes:''})

  //modal: hitting "Add" (add event).
  const addNewEvent = () => {
    console.log("You saved the new event.")
    console.log(newEventState)
    console.log(dateState)
    //CURRENTLY WORKS FOR EVENTS THAT OCCUR ONCE.
    //In order for us to have multiple events...
    // 1. CALCULATE an array of every future occurence's date.
    // 2. run addEvent() FOR EVERY occurance of a recurring event.
    let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
    let newEvent = {
      title: newEventState.title,
      groupId: newEventState.title + Date.now(),
      amount: newEventState.amount,
      isPayment: newEventState.isPayment,
      frequency: newEventState.frequency,
      website: newEventState.url,
      category: newEventState.category,
      notes: newEventState.notes,
      startingDate: dateState.startDate,
    }
    addEvent(token, newEvent)
      .then(()=>{
        cancelEvent()
      })
      .catch(e=>console.error(e))
  }


  return(
    <>
      <div className="container">
        {/* PAGE HEADER */}
        <h1 className = 'center white-text'>Upcoming Events</h1>
        <div className = "row"> 
            {/* MODAL with New Payment Form */}
            {/* https://react-materialize.github.io/react-materialize/?path=/story/javascript-modal--default */}
            <Modal id="newPaymentModal" className="center-align"
              actions={[
                <Button onClick={cancelEvent} flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Close
                </Button>,
                <span> </span>,
                <Button onClick={addNewEvent} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Save <i className="material-icons right">send</i>
                </Button>
              ]}
              header="Add New Event" trigger={createEvent}>
              <br></br>
              <form action="#">
                {/* MODAL 1st ROW: Title/Amount */}
                <div className="row">
                    <div className="switch"> {/* Is this Payment or Income?*/}
                      <label>
                        <div className="col s4 m5 l5 right-align">
                          <h6 style={newEventState.isPayment ? {color: "red", display:"inline"}:{display:"inline"}}>I am making a payment.</h6>
                        </div>
                        <div className="col s3 m2 l2">
                          <input id="paymentOrIncome" onChange={switchFunction} type="checkbox"/>
                          <span className="lever"></span>
                        </div>
                        <div className="col s5 m5 l5 left-align">
                          <h6 style={newEventState.isPayment ? {display:"inline"}:{color: "green", display:"inline"}}>I am receiving income.</h6>
                        </div>
                      </label>
                    </div>
                    {/* event title */}
                    <div className="input-field col s12 m6 l6">
                      <label style={newEventState.title.length ? {visibility: "hidden"} : {visibility: "visible"}} htmlFor="newTitle">Event Title</label>
                      <input id="newTitle" name="title" value={newEventState.title} onChange={newEventState.handleInputChange} />                
                    </div>
                    {/* dollar amount */}
                    <div className="input-field col s12 m6 l6">
                      <i className="material-icons prefix">attach_money</i>
                      <input placeholder="123.45" type="number" min="0.00" 
                              max="10000.00" step="0.01" name="amount"
                              value={newEventState.amount} onChange={newEventState.handleInputChange}/>
                    </div>
                </div> {/* end first row */}

                <div id="modalDivider"
                  style={{
                    width: "100%", height: "4px", 
                    borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                    borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                    }}>
                </div>

                {/* MODAL 2nd ROW: Dates/Frequencies */}
                <div className="row">
                  {/* Start Date  */}
                  <div className="col s5 m2 l2">
                    <p className="center">When is the first payment happening?</p>
                  </div>
                  <div className="col s7 m4 l4">
                    <DatePicker
                      placeholder="Select Start Date"
                      className="datePicker"
                      options={{
                        autoClose: false,    container: null,    defaultDate: null,    disableDayFn: null,
                        disableWeekends: false,    events: [],    firstDay: 0,    format: 'mmm dd, yyyy',
                        i18n: {cancel: 'Cancel',clear: 'Clear',done: 'Ok',
                          months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
                          monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                          nextMonth: '›',
                          previousMonth: '‹',
                          weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                          weekdaysAbbrev: ['S','M','T','W','T','F','S'],
                          weekdaysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
                        },
                        isRTL: false,maxDate: null,minDate: new Date(),onClose: null,onDraw: null,onOpen: null,onSelect: null,
                        parse: null,setDefaultDate: false,showClearBtn: false,showDaysInNextAndPreviousMonths: false,showMonthAfterYear: false,
                        yearRange: 10
                      }}
                      onChange={dateState.handleDatePick}
                    />
                  </div>
                  {/* Frequency */}
                  <div className="col s5 m2 l2">
                    <p className="center">How often will it occur?</p>
                  </div>
                  <div className="input-field col s7 m4 l4">
                    <select id="frequencySelect" className="browser-default" onChange={frequencySelect}>
                      <option value="" disabled selected>Choose an option</option>
                      <option value="once">Just once</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every two weeks</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Every three months</option>
                      <option value="biannual">Every six months</option>
                      <option value="annual">Once a year</option>
                      <option value="biennial">Every two years</option>
                    </select>
                  </div>
                </div> {/* end 2nd row */}

                {/* MODAL 3rd ROW: End Date (if frequency > once) */}
                {endDatePicker}
                
                <div id="modalDivider"
                  style={{
                    width: "100%", height: "4px", 
                    borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                    borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                    }}>
                </div>

                {/* MODAL 4th ROW: URL, Category, Notes */}
                <div className="row">
                  <h6>Additional info (optional)</h6>
                  <div className="input-field col s6 m6 l6">
                    <label style={newEventState.url.length ? {visibility: "hidden"} : {visibility: "visible"}} htmlFor="newURL">URL</label>
                    <input id="newURL" name="url" value={newEventState.url} onChange={newEventState.handleInputChange} />                
                  </div>
                  <div className="col s6 m6 l6">
                    <span style={{visibility:'hidden'}}>space stuff</span>
                    <select id="categorySelect" className="browser-default" onChange={categorySelect}>
                      <option value="" selected>Choose a category.</option>
                      <option value="housing">Housing Expense</option>
                      <option value="insurance">Insurance Payment</option>
                      <option value="loan">Loan Payment</option>
                      <option value="taxes">Taxes</option>
                      <option value="family">Family</option>
                      <option value="recreation">Recreation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="input-field col s12 m12 l12">
                    <textarea id="eventNotes" className="materialize-textarea" data-length="300" name="notes" value={newEventState.notes} onChange={newEventState.handleInputChange} ></textarea>
                    <label for="eventNotes">Notes</label>
                  </div>
                </div>

              </form>
            </Modal>
        </div>
        
        {/* CALENDAR CUSTOMIZATION (not functional)*/}
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
            events={calendarState.events} //array of events rendered on calendar.
          />
        </div>

      </div> {/* END CONTAINER */}
    </>
  )
}

export default MyCalendar