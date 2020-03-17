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
const {addEvent, addEvents, getEvents, editEvent, 
  // editEvents,
   deleteEvent, deleteEvents } = EventAPI

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
                  date: element.eventDate,
                  allDay: true, 
                  // classNames: ['Insurance'],
                  backgroundColor: colorFunction(element.category), //call some functions using user preferences for colors here.
                  borderColor: 'black',
                  textColor: 'white',
                  extendedProps: {
                    amount: element.amount,
                    isPayment: element.isPayment,
                    frequency: element.frequency,
                    category: element.category,
                    notes: element.notes,
                    url: element.website,
                    author: element.author,
                    groupStartDate: element.groupStartDate,
                    groupEndDate: element.groupEndDate,
                    eventNumber: element.eventNumber,
                    groupTotal: element.groupTotal
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
    title: '',    amount: 0,    isPayment: true,    frequency: 'once',    url: '',
    category: '',    notes: '',    isLoading: false,
    editingGroup: false, //switches if editing single event versus group.
    
    eventNumber: 1, groupTotal: 1,
    
    eventId: "",    groupId: "",
  })
  newEventState.handleInputChange = (event) => {
    setNewEventState({ ...newEventState, [event.target.name]: event.target.value })
  }

  //NEW EVENT START DATE
  const [newStartState, setNewStartState] = useState({
    startDate: ''
  })
  newStartState.handleStartDate = (date) => setNewStartState({startDate: date})
  
  //NEW EVENT END DATE
  const [newEndState, setNewEndState] = useState({
    endDate: ''
  })
  newEndState.handleEndDate = (date) => setNewEndState({endDate: date})

  
  //Button that triggers ADD modal.
  const createEvent = <Button id="newPayment" className="purple right white-text waves-effect waves-light">
    Add New Event</Button>;
  
  //add modal: payment vs income switch
  const paymentSwitch = () => setNewEventState({...newEventState, isPayment: !document.getElementById('paymentSwitch').checked})
  const editPaymentSwitch = () => setNewEventState({...newEventState, isPayment: !document.getElementById('editPaymentSwitch').checked})
  
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
              isRTL: false,maxDate: null,minDate: null,onClose: null,onDraw: null,onOpen: null,onSelect: null,
              parse: null,setDefaultDate: false,showClearBtn: false,showDaysInNextAndPreviousMonths: true,showMonthAfterYear: false,
              yearRange: 10
            }}
            onChange={newEndState.handleEndDate}
          />
        </div>
      </div>

  //add modal: category name to attach to event
  const categorySelect = () => setNewEventState({...newEventState, category: document.getElementById('categorySelect').value})

  //add modal: hitting "Close" (reset newEventState)
  const cancelEvent = () => {
    setNewEventState({title: '',amount: 0,isPayment: true, frequency: 'once',url:'',
                      category:'', notes:'', isLoading: false, editingGroup: false,
                      eventNumber: 1, groupTotal: 1,
                      eventId: "", groupId: ""})
    setNewStartState({startDate:''})
    setNewEndState({endDate: ''})
    setEditEventState({eventDate: ''})
    setEditStartState({startDate: ''})
    setEditEndState({endDate: ''})
  }

  //add modal: hitting "Save" adds event(s).
  const addNewEvents = () => {
    console.log("adding new events")
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
        eventDate: newStartState.startDate,
        groupStartDate: newStartState.startDate,
        groupEndDate: moment(newStartState.startDate).add(1, "day"),
        eventNumber: 1,
        groupTotal: 1,
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
      let startingDay = moment(newStartState.startDate).format('X')
      let endingDay = newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format('X') : moment(newStartState.startDate).add(5, 'years').format('X')
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
                eventDate: moment(newStartState.startDate).add(i, "week").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(2*i, "week").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(i, "month").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(3*i, "month").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(6*i, "month").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(i, "year").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
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
                eventDate: moment(newStartState.startDate).add(2*i, "year").format(),
                groupStartDate: moment(newStartState.startDate).format(),
                groupEndDate: newEndState.endDate ? moment(newEndState.endDate).add(1, 'day').format() : moment(newStartState.startDate).add(5, 'years').format(),
                eventNumber: i+1,
                groupTotal: occurences,
              })
            }
            break;
        }
      let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
      addEvents(token, newEvents)
      .then(()=>{
          cancelEvent() //reset newEventState, newStartState, newEndState
          window.location.reload()
      })
      .catch(e=>console.error(e))
    }
  }
  let loadingBar = newEventState.isLoading ? <div style={{backgroundColor: "violet", textColor:"white", zIndex:"3", width:"100vw", position: "fixed", bottom:0}}>
  <h6 id="loadingBar" className="center white-text">Adding events...</h6>
  </div> : null


  //EDITING EVENT single date (acts as new start date for group)
  const [editEventState, setEditEventState] = useState({
    eventDate: ''
  })
  editEventState.handleEventDate = (date) => setEditEventState({eventDate: date})
  //EDIT EVENT GROUP START DATE (stays as group's start date)
  const [editStartState, setEditStartState] = useState({
    startDate: ''
  })
  editStartState.handleStartDate = (date) => setEditStartState({startDate: date})
  //EDIT EVENT GROUP END DATE
  const [editEndState, setEditEndState] = useState({
    endDate: ''
  })
  editEndState.handleEndDate = (date) => setEditEndState({endDate: date})

  //handle CLICKING calendar event (SHOW EVENT CARD with options: Edit, Close, Delete)
  const eventCard = useRef()
  const handleEventClick = (e) => {
    console.log(e.event)
    console.log("You clicked on an event.")
    let selectedEvent = {
      title: e.event.title,
      id: e.event.id,
      groupId: e.event.groupId,
      title: e.event.title, 
      eventDate: moment(e.event.start).format(),
      groupStartDate: moment(e.event.extendedProps.groupStartDate).format(),
      groupEndDate: moment(e.event.extendedProps.groupEndDate).subtract(1, "day").format(),
      amount: e.event.extendedProps.amount,
      isPayment: e.event.extendedProps.isPayment,
      frequency: e.event.extendedProps.frequency,
      category: e.event.extendedProps.category,
      notes: e.event.extendedProps.notes,
      url: e.event.extendedProps.url,
      author: e.event.extendedProps.author,
      eventNumber: e.event.extendedProps.eventNumber,
      groupTotal: e.event.extendedProps.groupTotal,
    }
    //using newEventState and editStartState for editing modal.
    setEditEventState({eventDate: selectedEvent.eventDate})
    setEditStartState({startDate: selectedEvent.groupStartDate})
    setEditEndState({endDate: selectedEvent.groupEndDate})
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
      eventNumber: selectedEvent.eventNumber,
      groupTotal: selectedEvent.groupTotal,
      eventId: selectedEvent.id,
      groupId: selectedEvent.groupId,
    })
    setTimeout(()=>eventCard.current.click(), 0)
  }
  //clicking EDIT in event card.
  const editModal = useRef()
  const handleEditClick = ()=>{
    editModal.current.click()
  }
  //clicking DELETE in event card OR in editing modal.
  const deleteModal = useRef()
  const handleDeleteClick = () =>{
    console.log("You hit 'delete' button from event card.")
    deleteModal.current.click()
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
        placeholder= {moment(editEndState.endDate).format('ddd MMM Do, YYYY')}
        className="datePicker"
        options={{
          autoClose: false,    container: null,    defaultDate: editEndState.endDate,    disableDayFn: null,
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
          parse: null,setDefaultDate: true,showClearBtn: false,showDaysInNextAndPreviousMonths: true,showMonthAfterYear: false,
          yearRange: 10
        }}
        onChange={(date)=>setEditEndState({endDate: moment(date).format()})}
      />
    </div>
  </div>
  
  //editing modal: changing frequency
  const editFrequency = () => setNewEventState({...newEventState, frequency: document.getElementById('editFrequency').value})
  //editing modal: changing category of event(s)
  const changeCategory = () => setNewEventState({...newEventState, category: document.getElementById('changeCategory').value})

  //editing modal: hitting "Save" edits event(s)
  const confirmEdit = () =>{
    console.log("You changed the events.")
    if(newEventState.editingGroup) {
      //editing GROUP by form means DELETE EVERYTHING in that group, remake.
      deleteEvents(token, newEventState.groupId)
      .then(()=>{
        let startingDay = moment(editEventState.eventDate).format('X')
        let endingDay = editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format('X') : moment(editEventState.eventDate).add(5, 'years').format('X')
        let duration = endingDay - startingDay
        console.log(duration)
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
                  eventDate: moment(editEventState.eventDate).add(i, "week").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(2*i, "week").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(i, "month").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(3*i, "month").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(6*i, "month").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(i, "year").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
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
                  eventDate: moment(editEventState.eventDate).add(2*i, "year").format(),
                  groupStartDate: moment(editEventState.eventDate).format(),
                  groupEndDate: editEndState.endDate ? moment(editEndState.endDate).add(1, 'day').format() : moment(editEventState.eventDate).add(5, 'years').format(),
                  eventNumber: i+1,
                  groupTotal: occurences,
                })
              }
              break;
          }
        let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
        addEvents(token, newEvents)
        .then(()=>{
            cancelEvent() //reset newEventState, newStartState, newEndState
            window.location.reload()
        })
        .catch(e=>console.error(e))
      })
      .catch(e=>console.error(e))
  
    } else{
      //editing SINGLE EVENT (works for everything but groupStartDate, groupEndDate)
      let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
      editEvent(token, newEventState.eventId, {
        amount: newEventState.amount,
        isPayment: newEventState.isPayment,        
        website: newEventState.url,
        category: newEventState.category,
        notes: newEventState.notes,
        eventDate: editEventState.eventDate,
        groupStartDate: editStartState.startDate,
        groupEndDate: editEndState.endDate,
      })
      .then(()=>{
        console.log("You edited one event.")
        window.location.reload()
      })
      .catch(e=>console.error(e))
    }
  }

  //delete modal: choosing to delete group or delete single event.
  const deleteGroupSwitch = () => setNewEventState({...newEventState, editingGroup: document.getElementById('deleteGroupSwitch').checked})

  //delete modal: hitting "Delete" permanently deletes event(s)
  const confirmDelete = () =>{
    console.log("You deleted the event(s)")
    if (newEventState.editingGroup) {
      //Deleting group FUNCTIONING.
      let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
      let groupId = newEventState.groupId
      deleteEvents(token, groupId)
        .then(()=>console.log(`You deleted the ${newEventState.title} group`))
        .catch(e=>console.error(e))
    }else {
      //Deleting single event FUNCTIONING; still need to update event group.
      let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
      let id = newEventState.eventId
      deleteEvent(token, id)
        .then(()=>console.log(`You deleted ${newEventState.title}`))
        .catch(e=>console.error(e))
    }
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
                          <input id="paymentSwitch" onChange={paymentSwitch} type="checkbox"/>
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
                      onChange={newStartState.handleStartDate}
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
        
        {/* EVENT INFO CARD (when calendar event clicked) */}{/* needs styling */}
        <div className="row">
          <a ref={eventCard} className="modal-trigger" href='#eventCard'></a>
          <Modal id="eventCard" className="center-align"
            actions={[
              <Button onClick={handleEditClick} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                Edit <i className="material-icons right">send</i>
              </Button>,
              <span> </span>,
              <Button onClick={handleDeleteClick} modal="close" node="button" className="red white-text waves-effect waves-light hoverable" id="editBtn">
                Delete <i className="material-icons right">delete</i>
              </Button>,
              <span>  </span>,
              <Button flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                Close
              </Button>,
            ]}
            >
              <div> {/* CARD BODY */}
                  {/* Event Card Header: shows as Single Event or "${eventNumber} of ${groupTotal} */}
                  <h4>{newEventState.title}</h4>
                  <h5>{newEventState.frequency ==="once" ?
                    "Single Event"
                      :
                    "Event Number " + newEventState.eventNumber + " of " + newEventState.groupTotal
                    }</h5>
                <div>
                  <p>{newEventState.isPayment ? "Payment amount: $" + newEventState.amount : "Income amount: $" + newEventState.amount}</p>
                  <p>Date: {moment(editEventState.eventDate).format("MM-DD-YYYY")}</p>
                  <p>Frequency: {newEventState.frequency}</p>
                  <p>URL: {newEventState.url}</p>
                  <p>Notes: {newEventState.notes}</p>
                  <p>Category: {newEventState.category}</p>
                  <p>Group Start Date: {moment(editStartState.startDate).format("MM-DD-YYYY")}</p>
                  <p>Group End Date: {moment(editEndState.endDate).format("MM-DD-YYYY")}</p>
                </div>
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
                <Button onClick={confirmEdit} modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Save Changes <i className="material-icons right">send</i>
                </Button>,
                <span> </span>,
              ]}
              header={newEventState.editingGroup ? "Edit Group: " + newEventState.title : "Edit Event: " + newEventState.title + " (" + newEventState.eventNumber + " of " + newEventState.groupTotal + ")"}>
              <br></br>
              <form action="#">
                {/* EDITING MODAL 1st ROW: EditingGroup, isPayment switches */}
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
                        { newEventState.isPayment ?
                        <input id="editPaymentSwitch" onClick={editPaymentSwitch} type="checkbox"/>
                        :
                        <input id="editPaymentSwitch" onClick={editPaymentSwitch} type="checkbox" defaultChecked/>
                        }
                        <span className="lever"></span>
                      </div>
                      <div className="col s5 m5 l5 left-align">
                        <h6 style={newEventState.isPayment ? {display:"inline"}:{color: "green", display:"inline"}}>I am receiving income.</h6>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div id="modalDivider"
                  style={{
                    width: "100%", height: "4px", 
                    borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                    borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                    }}>
                </div>
                
                {/* EDITING MODAL 1.5TH ROW: TITLE AND AMOUNT */}
                <div className="row">
                    {/* edit event title: should only available if editing GROUP OF EVENTS. */}
                    <div className="input-field col s12 m6 l6">
                      <span className="left">Event Group Title:<h6>{newEventState.title}</h6></span>
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
                  <p className="center">{newEventState.editingGroup ? "New group start date?" : "New event date?"}</p>
                  </div>
                  <div className="col s7 m4 l4">
                    <DatePicker
                      placeholder={newEventState.editingGroup ? moment(editStartState.startDate).format('ddd MMM Do, YYYY') : moment(editEventState.eventDate).format('ddd MMM Do, YYYY')}
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
                        isRTL: false,maxDate: null,minDate: false,onClose: null,onDraw: null,onOpen: null,onSelect: null,
                        parse: null,setDefaultDate: false,showClearBtn: false,showDaysInNextAndPreviousMonths: false,showMonthAfterYear: false,
                        yearRange: 10
                      }}
                      onChange={
                        (date)=>setEditEventState({eventDate: moment(date).format()})
                      }
                    />
                  </div>
                  {/* Frequency -- can't be changed for single date*/}
                  {!newEventState.editingGroup ? null : 
                    <>
                      <div className="col s5 m2 l2">
                        <p className="center">New frequency?</p>
                      </div>
                      <div className="input-field col s7 m4 l4">
                        <select id="editFrequency" className="browser-default" onChange={editFrequency}>
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

                {/* EDITING MODAL 3rd ROW: End Date (if frequency > once) */}
                {editEndDate}
                
                <div id="modalDivider"
                  style={{
                    width: "100%", height: "4px", 
                    borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                    borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                    }}>
                </div>

                {/* EDITING MODAL 4th ROW: URL, Category, Notes */}
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
                    <select id="changeCategory" className="browser-default" onChange={changeCategory}>
                      <option value={newEventState.category} selected disabled>Select Category</option>
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
                    <textarea id="eventNotes" className="materialize-textarea" data-length="300" name="notes" value={newEventState.notes ? newEventState.notes : null} onChange={newEventState.handleInputChange} ></textarea>
                    <label for="eventNotes">Notes</label>
                  </div>
                </div>
              </form>
          </Modal>
        </div>
        {/* end editing modal */}
      
        {/* DELETE MODAL */}
        <div className="row">
          <a ref={deleteModal} className="modal-trigger" href='#deleteModal'></a>
          <Modal id="deleteModal" className="center-align"
              actions={[
                <Button onClick={confirmDelete} modal="close" node="button" className="red white-text waves-effect waves-light hoverable" id="editBtn">
                  {newEventState.editingGroup ? "Delete Group":"Delete Event"} <i className="material-icons right">delete</i>
                </Button>,
                <span>  </span>,
                <Button onClick={cancelEvent} flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                  Cancel
                </Button>,
              ]}
              // header={"Deleting: " + newEventState.title}
          >
            <br></br>
            <form action="#">
              {/* DELETE MODAL 1st ROW: Group versus single event*/}
              <div className="row"> 
                <div className="switch groupSwitch row"> {/* EDIT GROUP OR ONE EVENT */}
                  <label>
                    <div className="col s4 m5 l5 right-align">
                      <h6 style={newEventState.editingGroup ? {display:"inline"}:{color: "blue", display:"inline"}}>Delete Single Event</h6>
                    </div>
                    <div className="col s3 m2 l2">
                      <input id="deleteGroupSwitch" onChange={deleteGroupSwitch} type="checkbox"/>
                      <span className="lever"></span>
                    </div>
                    <div className="col s5 m5 l5 left-align">
                      <h6 style={newEventState.editingGroup ? {color: "deeppink", display:"inline"}:{display:"inline"}}>Delete Group of Events</h6>
                    </div>
                  </label>
                </div>
              </div>

              <div className="row"><div id="modalDivider"
                style={{
                  width: "100%", height: "4px", 
                  borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                  borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid"
                  }}>
              </div></div>

              {/* DELETE MODAL 2nd ROW: Selected Event(s) to delete */}
              {newEventState.editingGroup ? 
              <>
                <div className="row">
                  <h5>Are you sure you want to delete event group? ({newEventState.groupTotal} total)</h5> 
                  <h5>"{newEventState.title}"</h5>
                  <h6>starting {moment(editStartState.startDate).format("MMMM Do, YYYY")}</h6>
                  <h6>ending {moment(editEndState.endDate).format("MMMM, Do, YYYY")}</h6>
                </div>
              </>
              :
              <>
                <div className="row">
                  <h5>Are you sure you want to delete this event?</h5> 
                  <h5>"{newEventState.title}" </h5>
                  <h6>occuring on {moment(editStartState.startDate).format("MMMM Do, YYYY")}</h6>
                </div>
              </>}
            </form>
          </Modal>
        </div> {/* end delete modal */}

      </div> {/* END CONTAINER */}
    </>
  )
}

export default MyCalendar