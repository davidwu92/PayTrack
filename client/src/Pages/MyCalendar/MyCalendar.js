import React, { useState, useEffect, useRef } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
import UserAPI from '../../utils/UserAPI'
import EventAPI from '../../utils/EventAPI'
// import { useHistory } from 'react-router-dom'
// import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './myCalendar.css';
import '../../app.css'

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
import '../../app.css'

const { getColors } = UserAPI
const {addEvent, addEvents, getEvents } = EventAPI

const MyCalendar = () => {
//~~~~~~~~~~~~~~~~~~~~~~~~~CALENDAR VARIABLES/FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [calendarState, setCalendarState] = useState({
    // EVENT OBJECTS to throw into calendar. "All properties are read-only, use methods to modify."
    //https://fullcalendar.io/docs/event-object
    events: [],
  })
  const handleDateClick = (e) =>{ //INCOMPLETE
    //IDEALLY can add event to clicked date.
    console.log(e) //Gives me a fat object
    console.log(e.date)
  }
  const handleEventDrop = (e) =>{ //INCOMPLETE
    console.log(e.oldEvent) //info of pre-drop
    console.log(e.event) //info of after-drop
  }

//~~~~~~~~~~~~~~~~~POPULATE EVENTS on pageload~~~~~~~~~~~~~~~~~~
  let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
  useEffect(()=>{
    //FIRST grab user preferences (for colorPreferences) here.
    let colorPreferences = []
    getColors(token)
      .then(({data})=>{
        colorPreferences = data.colorPreferences
        //THEN grab events.
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
                  backgroundColor: colorFunction(element.category), //call some functions using user preferences for colors here.
                  borderColor: 'black',
                  textColor: 'white',
                  extendedProps: {
                    amount: element.amount,
                    groupEndDate: element.groupEndDate,
                    isPayment: element.isPayment,
                    frequency: element.frequency,
                    category: element.category,
                    notes: element.notes,
                    url: element.website,
                    author: element.author
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
    isLoading: false,
    editingGroup: false,
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

  //Button that triggers add modal.
  const createEvent = <Button id="newPayment" className="purple right white-text waves-effect waves-light">
    Add New Event</Button>;
  
  //add modal: payment vs income switch
  const switchFunction = () => setNewEventState({...newEventState, isPayment: !document.getElementById('paymentOrIncome').checked})
  
  //add modal: frequency selection
  const frequencySelect = () => setNewEventState({...newEventState, frequency: document.getElementById('frequencySelect').value})
  
  //add modal: endDatePicker row (shows up if frequency is anything but "once".)
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
  const cancelEvent = () => {
    setNewEventState({title: '',amount: 0,isPayment: true, frequency: 'once',url:'',category:'', notes:'', isLoading: false, editingGroup: false})
    setDateState({startDate:'', endDate:''})
  }

  //modal: hitting "Save" adds event(s).
  const addNewEvents = () => {
    setNewEventState({...newEventState, isLoading: true})
    if(newEventState.frequency =="once"){
      //create single event object.
      let newEvent = {
        title: newEventState.title,
        groupId: newEventState.title + "group",
        amount: newEventState.amount,
        isPayment: newEventState.isPayment,
        frequency: newEventState.frequency,
        website: newEventState.url,
        category: newEventState.category,
        notes: newEventState.notes,
        date: dateState.startDate,
        groupEndDate: dateState.startDate,
      }
      //add single event.
      addEvent(token, newEvent)
      .then(()=>{
          cancelEvent()
          window.location.reload()
      })
      .catch(e=>console.error(e))
    } else {
      //adding MULTIPLE EVENTS. Calculate # of events to create, populate newEvents array.
      let startingDay = moment(dateState.startDate).format('X')
      let endingDay = dateState.endDate ? moment(dateState.endDate).add(1, 'day').format('X') : moment(dateState.startDate).add(5, 'years').format('X')
      let duration = endingDay - startingDay
      let newEvents = []
      let occurences = 0
        switch (newEventState.frequency) {
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
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
                groupEndDate: dateState.endDate ? moment(dateState.endDate).add(1, 'day').format() : moment(dateState.startDate).add(5, 'years').format()
              })
            }
            break;
        }
      let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
      addEvents(token, newEvents)
      .then(()=>{
          cancelEvent()
          window.location.reload()
      })
      .catch(e=>console.error(e))
    }
  }
  let loadingBar = newEventState.isLoading ? <div style={{backgroundColor: "violet", textColor:"white", zIndex:"3", width:"100vw", position: "fixed", bottom:0}}>
  <h6 id="loadingBar" className="center white-text">Adding events...</h6>
  </div> : null

  //handle CLICKING calendar event (SHOW EVENT CARD with options: Edit, Close, Delete)
  const eventCard = useRef()
  const handleEventClick = (e) => {
    // console.log(e.event)
    let selectedEvent = {
      title: e.event.title,
      id: e.event.id,
      groupId: e.event.groupId,
      title: e.event.title, 
      date: new Date(e.event.start),
      groupEndDate: new Date(e.event.extendedProps.groupEndDate),
      amount: e.event.extendedProps.amount,
      isPayment: e.event.extendedProps.isPayment,
      frequency: e.event.extendedProps.frequency,
      category: e.event.extendedProps.category,
      notes: e.event.extendedProps.notes,
      url: e.event.extendedProps.url,
      author: e.event.extendedProps.author
    }
    console.log(selectedEvent)
    //using newEventState and dateState for editing modal.
    setDateState({
      ...dateState,
      startDate: selectedEvent.date,
      endDate: selectedEvent.groupEndDate,
    })
    setNewEventState({
      title: selectedEvent.title,
      amount: selectedEvent.amount,
      isPayment: selectedEvent.isPayment,
      frequency: selectedEvent.frequency,
      url: selectedEvent.url,
      category: selectedEvent.category,
      notes: selectedEvent.notes,
      isLoading: false,
      editingGroup: false,
    })
    setTimeout(()=>eventCard.current.click(), 0)
  }
  //clicking EDIT in event card.
  const editModal = useRef()
  const handleEditClick = ()=>{
    console.log(dateState)
    editModal.current.click()
  }
  //editing modal: group or single event switch
  const groupSwitch = () => setNewEventState({...newEventState, editingGroup: document.getElementById('groupSwitch').checked})

  //editing modal: endDatePicker:
  const editEndDate = !newEventState.editingGroup ? null
  :
  <div className="row">
    <div className="col s5 m2 l2">
      <p className="center">New End Date?</p>
    </div>
    <div className="col s7 m10 l10">
      <DatePicker
        placeholder= {moment(dateState.endDate).format('ddd MMM Do, YYYY')}
        className="datePicker"
        options={{
          autoClose: false,    container: null,    defaultDate: dateState.endDate,    disableDayFn: null,
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
          isRTL: false,maxDate: null,minDate: dateState.startDate,onClose: null,onDraw: null,onOpen: null,onSelect: null,
          parse: null,setDefaultDate: true,showClearBtn: false,showDaysInNextAndPreviousMonths: true,showMonthAfterYear: false,
          yearRange: 10
        }}
        onChange={dateState.handleEndDate}
      />
    </div>
  </div>
  
  //editing modal: hitting Delete button.
  const deleteEvent = () =>{
    console.log('you deleted the event.')
  }
  //editing modal: hitting "Save" edits event(s)
  const editEvent = () =>{
    console.log("You changed the events.")
  }
//PAGE RENDERING STUFF
  return(
    <>
      {loadingBar}
      <div className="container">
        {/* PAGE HEADER */}
        <h1 className = 'center white-text'>My Calendar</h1>

        {/* ADD EVENT MODAL (New Event Form) */}
        {/* https://react-materialize.github.io/react-materialize/?path=/story/javascript-modal--default */}
        <div className = "row"> 
          <Modal id="newPaymentModal" className="center-align"
              actions={[
                <Button onClick={cancelEvent} flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Close
                </Button>,
                <span> </span>,
                <Button onClick={addNewEvents} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Save <i className="material-icons right">send</i>
                </Button>
              ]}
              header="Add New Event" trigger={createEvent}>
              <br></br>
              <form action="#">
                {/* ADD EVENT MODAL 1st ROW: Title/Amount */}
                <div className="row">
                    <div className="switch moneySwitch"> {/* Is this Payment or Income?*/}
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

                {/* ADD MODAL 2nd ROW: Dates/Frequencies */}
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
                        isRTL: false,maxDate: null,minDate: null,onClose: null,onDraw: null,onOpen: null,onSelect: null,
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

                {/* ADD MODAL 3rd ROW: End Date (if frequency > once) */}
                {endDatePicker}
                
                <div id="modalDivider"
                  style={{
                    width: "100%", height: "4px", 
                    borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                    borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                    }}>
                </div>

                {/* ADD MODAL 4th ROW: URL, Category, Notes */}
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
                      <option value="" selected disabled>Choose a category.</option>
                      <option value="income">Income</option>
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
        
        {/* CALENDAR (contained in div.row) */}
        <div className = "row" style={{backgroundColor: "ghostwhite", padding: "1vw"}}>
          <FullCalendar 
            defaultView="dayGridMonth"
            header={{
              center: "title",
              left: "prevYear,prev",
              right: "next,nextYear"
            }}
            eventStartEditable={true}
            plugins={[ dayGridPlugin, interactionPlugin ]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            events={calendarState.events} //array of events rendered on calendar.
          />
        </div>
        
        {/* EVENT INFO CARD (triggers when calendar event clicked) */}
        {/* needs styling */}
        <div className="row">
          <a ref={eventCard} className="modal-trigger" href='#eventCard'></a>
          <Modal id="eventCard" className="center-align"
            actions={[
              <Button onClick={handleEditClick} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                Edit <i className="material-icons right">send</i>
              </Button>,
              <span> </span>,
              <Button onClick={deleteEvent} modal="close" node="button" className="red white-text waves-effect waves-light hoverable" id="editBtn">
                Delete <i className="material-icons right">delete</i>
              </Button>,
              <span>  </span>,
              <Button flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                Close
              </Button>,
            ]}
            header={newEventState.title + " " + moment(dateState.startDate).format('MM-DD-YY')}>
              <div> {/* CARD BODY */}
                <div className="switch groupSwitch row"> {/* SEE GROUP OR ONE EVENT */}
                  <label>
                    <div className="col s4 m5 l5 right-align">
                      <h6 style={newEventState.editingGroup ? {display:"inline"}:{color: "blue", display:"inline"}}>Single Event Details</h6>
                    </div>
                    <div className="col s3 m2 l2">
                      <input id="groupSwitch" onChange={groupSwitch} type="checkbox"/>
                      <span className="lever"></span>
                    </div>
                    <div className="col s5 m5 l5 left-align">
                      <h6 style={newEventState.editingGroup ? {color: "deeppink", display:"inline"}:{display:"inline"}}>Event Group Details</h6>
                    </div>
                  </label>
                </div>
                <div>
                  <p>Amount: {newEventState.amount}</p>
                  <p>Frequency: {newEventState.frequency}</p>
                  <p>URL: {newEventState.url}</p>
                  <p>Notes: {newEventState.notes}</p>
                  <p>Category: {newEventState.category}</p>
                </div>
                      {newEventState.editingGroup ? 
                      <div>
                        {/* MUST HAVE GROUP START DATE AND TOTAL NUMBER OF EVENTS ATTACHED TO EACH EVENT */}
                      </div>:
                      <div>
                        <p>Amount: {newEventState.amount}</p>
                        <p>Frequency: {newEventState.frequency}</p>
                        <p>URL: {newEventState.url}</p>
                        <p>Notes: {newEventState.notes}</p>
                        <p>Category: {newEventState.category}</p>
                      </div>}
              </div> {/* END OF CARD BODY */}
          </Modal>
        </div>
        
        {/* EDITING MODAL */}
        <div className="row">
          <a ref={editModal} className="modal-trigger" href='#editModal'></a>
          <Modal id="editModal" className="center-align"
              actions={[
                <Button onClick={cancelEvent} flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Cancel
                </Button>,
                <span> </span>,
                <Button onClick={editEvent} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Save Changes <i className="material-icons right">send</i>
                </Button>,
                <span> </span>,
                <Button onClick={deleteEvent} modal="close" node="button" className="red white-text waves-effect waves-light hoverable" id="editBtn">
                  {newEventState.editingGroup ? "Delete Group":"Delete Event"} <i className="material-icons right">send</i>
                </Button>
              ]}
              header={"Editing: " + newEventState.title}>
              <br></br>
              <form action="#">
                {/* EDITING MODAL 1st ROW: EditingGroup, Title/Amount */}
                <div className="row">
                  <div className="switch groupSwitch row"> {/* EDIT GROUP OR ONE EVENT */}
                    <label>
                      <div className="col s4 m5 l5 right-align">
                        <h6 style={newEventState.editingGroup ? {display:"inline"}:{color: "blue", display:"inline"}}>Edit Single Event</h6>
                      </div>
                      <div className="col s3 m2 l2">
                        <input id="groupSwitch" onChange={groupSwitch} type="checkbox"/>
                        <span className="lever"></span>
                      </div>
                      <div className="col s5 m5 l5 left-align">
                        <h6 style={newEventState.editingGroup ? {color: "deeppink", display:"inline"}:{display:"inline"}}>Edit Group of Events</h6>
                      </div>
                    </label>
                  </div>
                    <br></br>
                    <div className="switch moneySwitch"> {/* Is this Payment or Income?*/}
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
                    {/* edit event title */}
                    <div className="input-field col s12 m6 l6">
                      <label style={newEventState.title.length ? {visibility: "hidden"} : {visibility: "visible"}} htmlFor="newTitle">Event Title</label>
                      <input id="newTitle" name="title" value={newEventState.title} onChange={newEventState.handleInputChange} />                
                    </div>
                    {/* edit dollar amount */}
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

                {/* EDITING MODAL 2nd ROW: Dates/Frequencies */}
                <div className="row">
                  {/* Start Date  */}
                  <div className="col s5 m2 l2">
                    <p className="center">New start date?</p>
                  </div>
                  <div className="col s7 m4 l4">
                    <DatePicker
                      placeholder={new Date(dateState.startDate)}
                      className="datePicker"
                      options={{
                        autoClose: false,    container: null,    defaultDate: new Date(dateState.startDate),    disableDayFn: null,
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
                        isRTL: false,maxDate: null,minDate: false,onClose: null,onDraw: null,onOpen: null,onSelect: null,
                        parse: null,setDefaultDate: true,showClearBtn: false,showDaysInNextAndPreviousMonths: false,showMonthAfterYear: false,
                        yearRange: 10
                      }}
                      onChange={dateState.handleDatePick}
                    />
                  </div>
                  {/* Frequency -- can't be changed for single date*/}
                  {!newEventState.editingGroup ? null : 
                    <>
                      <div className="col s5 m2 l2">
                        <p className="center">New frequency?</p>
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
                    </>
                  }
                </div> {/* end 2nd row */}

                {/* MODAL 3rd ROW: End Date (if frequency > once) */}
                {editEndDate}
                
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
                  <label style={newEventState.url.length ? {visibility: "hidden"} : {visibility: "visible"}} htmlFor="newURL">{newEventState.website ? newEventState : "URL"}</label>
                    <input id="newURL" name="url" value={newEventState.url} onChange={newEventState.handleInputChange} />                
                  </div>
                  <div className="col s6 m6 l6">
                    <span 
                      // style={{visibility:'hidden'}}
                    >
                      Category</span>
                    <select id="categorySelect" className="browser-default" onChange={categorySelect}>
                      <option value="" selected disabled>Choose new category.</option>
                      <option value="income">Income</option>
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
                    <textarea id="eventNotes" className="materialize-textarea" data-length="300" name="notes" placeholder={newEventState.notes ? newEventState.notes : "Write new notes."} onChange={newEventState.handleInputChange} ></textarea>
                    <label for="eventNotes">Notes</label>
                  </div>
                </div>
              </form>

          </Modal>
        </div>
      
      </div> {/* END CONTAINER */}
    </>
  )
}

export default MyCalendar