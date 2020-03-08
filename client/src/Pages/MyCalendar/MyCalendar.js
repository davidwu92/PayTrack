import React, { useState, useEffect } from 'react'
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

import moment from 'moment'
//FullCalendar Imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
//https://fullcalendar.io/docs#toc

import ColorPreferences from '../../Components/ColorPreferences'
import '../../App.css'

const { addEvent, getEvents, getColors } = UserAPI

const MyCalendar = () => {
//~~~~~~~~~~~~~~~~~~~~~~~~~CALENDAR VARIABLES/FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [calendarState, setCalendarState] = useState({
    // EVENT OBJECTS to throw into calendar. "All properties are read-only, use methods to modify."
    //https://fullcalendar.io/docs/event-object
    events: [
        //FIRST PAYMENT INSTANCE
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
            //     tags: ["Family", "Insurance"],
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
    console.log(e.date)
  }
  const handleEventClick = (e) => {
    console.log(e)
    console.log(e.event.extendedProps)
    //gives {event, el (html element), jsEvent (click info), view (current view object)}
    //Ideally triggers a viewing/editing modal.
  }
//~~~~~~~~~~~~~~~~~POPULATE EVENTS on pageload~~~~~~~~~~~~~~~~~~
let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
useEffect(()=>{
  //FIRST grab user preferences (for colorPreferences) here.
  let colorPreferences = []
  getColors(token)
    .then(({data})=>{
      colorPreferences = data.colorPreferences
      //SECOND grab events.
        getEvents(token)
        .then(({data})=>{
          let myEvents = []
          if (data.length) {
            data.forEach((element) => {
              //COLOR FUNCTION.
              const colorFunction = (category) =>{
                let color
                switch (category) {
                  case "housing": color=colorPreferences[0]
                  break;
                  case "insurance": color=colorPreferences[1]
                  break;
                  case "loan": color=colorPreferences[2]
                  break;
                  case "taxes": color=colorPreferences[3]
                  break;
                  case "family": color=colorPreferences[4]
                  break;
                  case "recreation": color=colorPreferences[5]
                  break;
                  case "income": color=colorPreferences[6]
                  break;
                  case "other": color=colorPreferences[7]
                  break;
                  default: color=colorPreferences[7]
                }
                return color
              }
              let calendarEvent = {
                id: element._id,
                groupId: element.groupId,
                title: element.title, 
                date: element.date,
                allDay: true, 
                // classNames: ['Insurance'],
                editable: true,
                backgroundColor: colorFunction(element.category), //call some functions using user preferences for colors here.
                borderColor: 'black',
                textColor: 'white',
                extendedProps: {
                  amount: "$"+ element.amount,
                  category: element.category,
                  notes: element.notes,
                  url: element.website
                }
              }
              myEvents.push(calendarEvent)
            })
          }
          setCalendarState({...calendarState, events: myEvents})
        })
    })
    .catch(e=>console.error(e))
}, [])


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
  const createEvent = <Button id="newPayment" className="purple right white-text waves-effect waves-light">
    Add New Event</Button>;
  
  //modal: payment vs income switch
  const switchFunction = () => setNewEventState({...newEventState, isPayment: !document.getElementById('paymentOrIncome').checked})
  
  //modal: frequency selection
  const frequencySelect = () => setNewEventState({...newEventState, frequency: document.getElementById('frequencySelect').value})
  
  //modal: endDatePicker row (shows up if frequency is anything but "once".)
  const endDatePicker = newEventState.frequency ==='once' ? null
    : 
      <div className="row">
        <div className="col s5 m2 l2">
          <p className="center">End date? (5 years from start date by default)</p>
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
              isRTL: false,maxDate: null,minDate: new Date(dateState.startDate),onClose: null,onDraw: null,onOpen: null,onSelect: null,
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

  //modal: hitting "Save" (adds event).
  const addNewEvent = () => {
    let startingDay = moment(dateState.startDate).format('X')
    let endingDay = dateState.endDate ? moment(dateState.endDate).add(1, 'hour').format('X') : moment(dateState.startDate).add(5, 'years').format('X')
    let duration = endingDay - startingDay
    let newEvents = []
    let occurences = 0
    //In order for us to have multiple events, first calculate how many occurences to create.
    //Calculating number of events to populate newEvents.
    switch (newEventState.frequency) {
      case "once":
        newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: dateState.startDate,}
        )
        break;
      case "weekly":
        occurences = Math.ceil(duration / 604800)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(i, "week").format(),
          })
        }
        break;
      case "biweekly":
        occurences = Math.ceil(duration / 1209600)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(2*i, "week").format(),
          })
        }
        break;
      case "monthly":
        occurences = Math.ceil(duration / 2628333)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(i, "month").format(),
          })
        }
        break;
      case "quarterly":
        occurences = Math.ceil(duration / 7885000)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(3*i, "month").format(),
          })
        }
        break;
      case "biannual":
        occurences = Math.ceil(duration / 15770000)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(6*i, "month").format(),
          })
        }
        break;
      case "annual":
        occurences = Math.ceil(duration / 31536000)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(i, "year").format(),
          })
        }
        break;
      case "biennial":
        occurences = Math.ceil(duration / 63080000)
        for (let i = 0; i<occurences; i++){
          newEvents.push({
            title: newEventState.title,
            groupId: newEventState.title + "group",
            amount: newEventState.amount,
            isPayment: newEventState.isPayment,
            frequency: newEventState.frequency,
            website: newEventState.url,
            category: newEventState.category,
            notes: newEventState.notes,
            date: moment(dateState.startDate).add(2*i, "year").format(),
          })
        }
        break;
    }
    let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
    newEvents.forEach((newEvent)=>{
      addEvent(token, newEvent)
      .then(()=>{
        console.log("You posted a new event or series of events.")
        cancelEvent()
        window.location.reload()
      })
      .catch(e=>console.error(e))
    })
  }

//PAGE RENDERING STUFF
  return(
    <>
      <div className="container">
        {/* PAGE HEADER */}
        <h1 className = 'center white-text'>My Calendar</h1>
        {/* MODAL with New Payment Form */}
        {/* https://react-materialize.github.io/react-materialize/?path=/story/javascript-modal--default */}
        <div className = "row"> 
          
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
                    <span 
                      // style={{visibility:'hidden'}}
                    >
                      Category</span>
                    <select id="categorySelect" className="browser-default" onChange={categorySelect}>
                      {newEventState.isPayment ? 
                        <><option value="" selected>Choose a category.</option></>
                        :
                        <><option value="income" selected>Income</option></>
                      }
                      {/* <option value="" selected>Choose a category.</option>
                      <option value="income">Income</option> */}
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
          <ColorPreferences/>
        </div>
        
        {/* CALENDAR CUSTOMIZATION (not functional)*/}
        
        
        {/* CALENDAR STUFF (contained in div.row) */}
        <div className = "row" style={{backgroundColor: "ghostwhite", padding: "1vw"}}>
          <FullCalendar 
            defaultView="dayGridMonth"
            header={{
              center: "title",
              left: "prevYear,prev",
              right: "next,nextYear"
            }}
            // droppable= {true} 
            //lets me drag and drop events.
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