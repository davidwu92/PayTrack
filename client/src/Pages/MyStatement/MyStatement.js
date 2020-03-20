import React, { useState, useEffect, useRef } from 'react'
import {Modal, Button} from 'react-materialize'
import UserAPI from '../../utils/UserAPI'
import EventAPI from '../../utils/EventAPI'
import moment from 'moment'
import './myStatement.css'

// import { greatestDurationDenominator } from '@fullcalendar/core'

const {getColors} = UserAPI
const {getEvents} = EventAPI

const MyStatement = () => {
//TABLE VARIABLES
  const [tableState, setTableState] = useState({
    events: [],
    cumSum: [],
    colorPreferences: [],
  })

//FILTERING CATEGORIES
  const [categoryState, setCategoryState] = useState({
    array: [true, true, true, true, true, true, true, true]
  })
  //Toggle Categories with buttons
  const toggleCategory = (e) =>{
    let catNum = parseInt(e.target.name)
    let categoryArray = categoryState.array
    categoryArray[catNum] = !categoryArray[catNum]
    setCategoryState({array: categoryArray})
    getTableData({categoryFilter: categoryState.array, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }
  const allCategories = () => {   //Show ALL Categories
    let allTrue = [true, true, true, true, true, true, true, true]
    setCategoryState({array: allTrue})
    getTableData({categoryFilter: allTrue, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }
  const noCategories = () => {  //Show NO Categories
    let allFalse = [false, false, false, false, false, false, false, false]
    setCategoryState({array: [false, false, false, false, false, false, false, false]})
    getTableData({categoryFilter: allFalse, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }

//FILTERING BY TIME
  const [timeState, setTimeState] = useState({
    monthDisplayed: 12, //defaults to showing whole year.
    yearDisplayed: "all years", //defaults to showing all years.
  })
  const monthSelect = () => { //Show Specific Month (must choose year first)
    let month = document.getElementById("monthSelect").value
    setTimeState({...timeState, monthDisplayed: month})
    getTableData({categoryFilter: categoryState.array, monthFilter: month, yearFilter: timeState.yearDisplayed})
  }
  const yearSelect = () =>{ //Show Specific Year (default "all years")
    let year = document.getElementById("yearSelect").value
    setTimeState({...timeState, yearDisplayed: year})
    getTableData({categoryFilter: categoryState.array, monthFilter: timeState.monthDisplayed, yearFilter: year})
  }

//SETS UP events and cumSum in tableState, depending on filters object.
  const getTableData = (filters) =>{
    let colorPreferences = []
    getColors(token)
    .then(({data})=>{
      //got color preferences, now need all this user's events.
      colorPreferences = data.colorPreferences
      getEvents(token)
      .then(({data})=>{
        let filteredArray = []
        data.forEach((event)=>{
          //Check if category is turned on
          if ((event.category=="housing" && filters.categoryFilter[0])
          ||(event.category =="insurance" && filters.categoryFilter[1])
          ||(event.category=="loan" && filters.categoryFilter[2])
          ||(event.category=="taxes" && filters.categoryFilter[3])
          ||(event.category=="family" && filters.categoryFilter[4])
          ||(event.category=="recreation" && filters.categoryFilter[5])
          ||(event.category=="income" && filters.categoryFilter[6])
          ||((event.category=="other" || event.category == "") && filters.categoryFilter[7])
          ) {
            if (filters.yearFilter === "all years"){
              //check if "all years" is on
            filteredArray.push(event)
            }
            else if (moment(event.eventDate).year() === parseInt(filters.yearFilter)){
              //check if event matches year filter.
              if(filters.monthFilter ===12){
                //no month filter: pushes everything w/ selected year.
                filteredArray.push(event)
              } else if (parseInt(filters.monthFilter) === moment(event.eventDate).month()){
                //month filter: pushes everything w/ selected year and month.
                filteredArray.push(event)
              }
            }
          }
        })
        let events = filteredArray.sort((a, b)=>a.eventDate > b.eventDate ? 1 : -1)
        let amounts = []
        let cumSum = []
        let myEvents=[]
        if (events.length) {
          events.forEach((event) => {            
              //push each event's amount as positive or negative to amounts arr
              amounts.push(event.isPayment ? -event.amount : event.amount)

              //determine backgroundColor using user preferences.
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
              //create event objects to populate table.
              let calendarEvent = {
                id: event._id,
                groupId: event.groupId,
                title: event.title, 
                date: event.eventDate,
                allDay: true, 
                // classNames: ['Insurance'],
                backgroundColor: colorFunction(event.category), //call some functions using user preferences for colors here.
                borderColor: 'black',
                textColor: 'white',
                extendedProps: {
                  amount: event.amount,
                  isPayment: event.isPayment,
                  frequency: event.frequency,
                  category: event.category,
                  notes: event.notes,
                  url: event.website,
                  author: event.author,
                  groupStartDate: event.groupStartDate,
                  groupEndDate: event.groupEndDate,
                  eventNumber: event.eventNumber,
                  groupTotal: event.groupTotal
                }
              }
              myEvents.push(calendarEvent)
          }) //end forEach Event function.

          amounts.forEach((amount, index, arr)=>{
            let sum = 0
            for(let i = 0; i<=index; i++){
              sum = sum + arr[i]
            }
            cumSum.push(sum)
          })
        } else {
          console.log("You have no events.")
        }
        setTableState({...tableState, events: myEvents, cumSum: cumSum, colorPreferences: colorPreferences})
      })
      .catch(e=>console.error(e))
    })
    .catch(e=>console.error(e))
  }

  //on pageload, grab color preferences and event data.
  let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
  useEffect(()=>{
    getTableData({categoryFilter: categoryState.array, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }, [])

//TABLE STUFF
  //Creating table header.
  const tableTitle = () => {
    let monthNum = parseInt(timeState.monthDisplayed)+1
    let formattedMonth = monthNum >= 10 ?  
      moment(`${monthNum}`, `MM`).format("MMMM")
      : moment(`0${monthNum}`, `MM`).format("MMMM")
    if (timeState.yearDisplayed == "all years") {
      return("All-Time Statement")
    } else if (monthNum == 13){
      //Year selected, all months
      return(timeState.yearDisplayed + " Statement")
    } else { //Year and Month selected
      return(formattedMonth +" "+ timeState.yearDisplayed + " Statement")
    }
  }
  const [eventState, setEventState] = useState({
    event: {extendedProps:""}
  })
  //TABLE ROW: click
  const eventCard = useRef()
  const rowClick = (event) => {
    setEventState({event: event})
    console.log(event)
    setTimeout(()=>eventCard.current.click(), 0)
  }
  //TABLE ROW: onMouseOver, onMouseLeave
  const highlightRow = e => e.currentTarget.className = "yellow lighten-5"
  const unhighlightRow = e => e.currentTarget.className=""

  //FORMAT NUMBERS:
  const formatNumber = num => {
    // if (typeof num =="number"){
      let formattedNum = num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      return (formattedNum)
    // }
  }

  const totalIncome = () => { //Calculate total income
    let total = 0
    tableState.events.forEach(event=>{
      if(!event.extendedProps.isPayment){total = total + event.extendedProps.amount}
    })
    return("$"+formatNumber(Math.floor(total*100)/100))
  }
  const totalExpense = () =>{ //Calculate total expenses
    let total = 0
    tableState.events.forEach(event=>{
      if(event.extendedProps.isPayment){total = total + event.extendedProps.amount}
    })
    return("$"+formatNumber(Math.floor(total*100)/100))
  }

  //testing button
  const seeTableState = () =>{
    // console.log(tableState)
    console.log(eventState.event)
    // console.log(timeState)
    //FORMATTING FOR "Monday November 4th, 2019"
    // console.log(moment(tableState.events[0]).format('dddd MMMM Do, YYYY'))
  }

  return (
    <>
      <div className="container">
        {/* <button onClick={seeTableState}>TABLE STATE </button> */}
        <h2 className="center white-text">My Statements</h2>
        <h6 className = 'center white-text'>See a detailed summary of your financial activity. Select specific categories, months, and/or years to include in your statement.</h6>
        {/* 1st ROW: FILTERS for Category, Month, Year */}
        <div className="row" id="myStatementFirstRow">
          {/* YEAR SELECTOR */}
          <div className="col s5 m6 l6">
            <div className="center input-field col s12 m3 l3" id="timeFilterTitleDiv">
              <h6 className="white-text" id="timeFilterTitle">Year Select</h6>
            </div>
            <div className="center input-field col s12 m7 l7" id="timeFilterSelectDiv">
                <select id="yearSelect" className="browser-default" onChange={yearSelect}>
                  <option value={"all years"} selected>All time</option>
                  <option value={moment(Date.now()).subtract(2, "year").year()}>{moment(Date.now()).subtract(2, "year").year()}</option>
                  <option value={moment(Date.now()).subtract(1, "year").year()}>{moment(Date.now()).subtract(1, "year").year()}</option>
                  <option value={moment(Date.now()).year()}>{moment(Date.now()).add(0, "year").year()}</option>
                  <option value={moment(Date.now()).add(1, "year").year()}>{moment(Date.now()).add(1, "year").year()}</option>
                  <option value={moment(Date.now()).add(2, "year").year()}>{moment(Date.now()).add(2, "year").year()}</option>
                  <option value={moment(Date.now()).add(3, "year").year()}>{moment(Date.now()).add(3, "year").year()}</option>
                  <option value={moment(Date.now()).add(4, "year").year()}>{moment(Date.now()).add(4, "year").year()}</option>
                  <option value={moment(Date.now()).add(5, "year").year()}>{moment(Date.now()).add(5, "year").year()}</option>
                  <option value={moment(Date.now()).add(6, "year").year()}>{moment(Date.now()).add(6, "year").year()}</option>
                  <option value={moment(Date.now()).add(7, "year").year()}>{moment(Date.now()).add(7, "year").year()}</option>
                  <option value={moment(Date.now()).add(8, "year").year()}>{moment(Date.now()).add(8, "year").year()}</option>
                  <option value={moment(Date.now()).add(9, "year").year()}>{moment(Date.now()).add(9, "year").year()}</option>
                  <option value={moment(Date.now()).add(10, "year").year()}>{moment(Date.now()).add(10, "year").year()}</option>
                </select>
            </div>
          </div>
          {/* MONTH SELECTOR */}
          <div className="col s7 m6 l6">
            <div className="center input-field col s12 m3 l3" id="timeFilterTitleDiv">
              <h6 className="white-text" id="timeFilterTitle">Month Select</h6>
            </div>
            <div className="center input-field col s12 m7 l7" id="timeFilterSelectDiv">
                <select id="monthSelect" className="browser-default" onChange={monthSelect}>
                  {
                    timeState.yearDisplayed === "all years" ? 
                    <><option value="12" selected>All months in {timeState.yearDisplayed}</option>
                    <option value="0" disabled>January</option>
                    <option value="1" disabled>February</option>
                    <option value="2" disabled>March</option>
                    <option value="3" disabled>April</option>
                    <option value="4" disabled>May</option>
                    <option value="5" disabled>June</option>
                    <option value="6" disabled>July</option>
                    <option value="7" disabled>August</option>
                    <option value="8" disabled>September</option>
                    <option value="9" disabled>October</option>
                    <option value="10" disabled>November</option>
                    <option value="11" disabled>December</option></>
                    :
                    <><option value="12" selected>See all months in {timeState.yearDisplayed}</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option></>
                  }
                </select>
            </div>
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="center input-field col s12 m12 l12">
            <button className="btn-small" onClick={toggleCategory} name="0"
              style={categoryState.array[0] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[0]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[0]}}>
                HOUSING</button>
            <button className="btn-small"
              onClick={toggleCategory} name="1" style={categoryState.array[1] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[1]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[1]}}>
                INSURANCE</button>
            <button className="btn-small" onClick={toggleCategory} name="2"
              style={categoryState.array[2] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[2]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[2]}}>
                LOAN</button>
            <button className="btn-small" onClick={toggleCategory} name="3"
              style={categoryState.array[3] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[3]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[3]}}>
                TAXES</button>
            <button className="btn-small" onClick={toggleCategory} name="4"
              style={categoryState.array[4] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[4]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[4]}}>
                FAMILY</button>
            <button className="btn-small" onClick={toggleCategory} name="5"
              style={categoryState.array[5] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[5]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[5]}}>
                RECREATION</button>
            <button className="btn-small" onClick={toggleCategory} name="6"
              style={categoryState.array[6] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[6]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[6]}}>
                INCOME</button>
            <button className="btn-small" onClick={toggleCategory} name="7"
              style={categoryState.array[7] ? {margin: "2px", fontWeight:"600", backgroundColor: tableState.colorPreferences[7]} 
              : {margin: "2px", fontWeight:"600", backgroundColor: "ghostwhite", color: tableState.colorPreferences[7]}}>
                OTHER</button>
            {/* <div className="row"> */}
              {/* <div className="center col s6 m6 l6"> */}
                <button onClick={allCategories} className="btn purple" style={{margin:"2px", fontWeight:"600"}}>ALL</button>
              {/* </div> */}
              {/* <div className="center col s6 m6 l6"> */}
                <button onClick={noCategories} className="btn white purple-text" style={{margin:"2px", fontWeight:"700"}}>NONE</button>
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>

        {/* 2nd ROW: INCOME/EXPENSE TABLE */}
        <div className="row white" id="tableRow">
          <h5 className="center blue-grey-text text-darken-3" id="tableTitle">{tableTitle()}</h5>
          <table className="centered responsive-table">
            <thead>
              <tr className="blue lighten-4 blue-grey-text text-darken-4">
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {tableState.events.map((event, i)=>
                <tr 
                  onMouseOver={highlightRow} onMouseLeave={unhighlightRow}
                  onClick={()=>rowClick(event)} style={i%2 ? {}:{backgroundColor: "aliceblue"}}>
                  <td>{moment(event.date).format('MMMM D, YYYY')}</td>
                  <td>{event.extendedProps.groupTotal == 1 ? event.title 
                      :event.title + " (" + event.extendedProps.eventNumber + "/" + event.extendedProps.groupTotal + ")"}
                    </td>
                  <td><div style={{textTransform: "uppercase", backgroundColor: event.backgroundColor, color: "white"}}>{event.extendedProps.category}</div></td>
                  {event.extendedProps.isPayment? 
                  <>
                    <td></td>
                    <td style={{fontWeight: "500", color: "maroon"}}>{"$" + formatNumber(event.extendedProps.amount)}</td>
                  </>
                  : <>
                    <td style={{fontWeight: "500", color: "darkgreen"}}>{"$" + formatNumber(event.extendedProps.amount)}</td>
                    <td></td>
                  </>}
                  <td style={tableState.cumSum[i]>0 ? {fontWeight: "500", color: "darkgreen"}:{fontWeight: "600", color: "maroon"}}>
                    {tableState.cumSum[i]>0 ? "$"+formatNumber(Math.floor(tableState.cumSum[i]*100)/100):"-$"+ formatNumber(-Math.floor(tableState.cumSum[i]*100)/100)}</td>
                </tr>
              )}
              {/* Totals row */}
              <tr className="deep-orange lighten-5">
                <td style={{fontWeight: "600"}}>{tableState.events.length? <>{moment(tableState.events[0].date).format('MM/DD/YY') +" - " +moment(tableState.events[tableState.events.length-1].date).format('MM/DD/YY')}</>:null}
                </td>
                <td style={{fontWeight: "600"}}>Events: {tableState.events.length}</td>
                <td style={{fontWeight: "600"}}><div style={{backgroundColor: "tomato", color:"white"}}>TOTAL</div></td>
                <td style={{fontWeight: "600", color: "darkgreen"}}>
                    Income: {totalIncome()}</td>
                <td style={{fontWeight: "600", color: "maroon"}}>
                    Expense: {totalExpense()}</td>
                <td style={tableState.cumSum[tableState.cumSum.length-1]>0 ? {fontWeight: "600", color: "darkgreen"}:{fontWeight: "600", color: "maroon"}}>
                  Balance: 
                  {tableState.cumSum[tableState.cumSum.length-1]>0 ? 
                  " $"+formatNumber(Math.floor(tableState.cumSum[tableState.cumSum.length-1]*100)/100)
                  :" -$"+ formatNumber(-Math.floor(tableState.cumSum[tableState.cumSum.length-1]*100)/100)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* CLICKED EVENT MODAL */}
        <div className="row">
          <a ref={eventCard} className="modal-trigger" href='#eventCard'></a>
          <Modal id="eventCard" className="center-align"
            actions={[
              <Button flat modal="close" node="button" className="purple white-text waves-effect waves-light hoverable" id="editBtn">
                Close
              </Button>,
            ]}
            >
              <div> {/* CARD BODY */}
                  {/* Event Card Header: shows as Single Event or "${eventNumber} of ${groupTotal} */}
                <h5>{eventState.event.title} ({moment(eventState.event.date).format("MM-DD-YY")})</h5>
                <div id="modalDivider" className="col s12 m12 l12"
                    style={{
                      width: "100%", height: "4px", 
                      borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                      borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid",
                      marginTop: "10px", marginBottom:"10px"
                      }}>
                  </div>
                <div className="row">
                  <div className="left col s12 m6 l6 purple lighten-4">
                    <h6 style={{fontWeight:"600"}}>~Event Details~</h6>
                    <div style={{width: "50%", position:"relative", left:"25%", padding:"3px", paddingRight:"5px",paddingLeft:"5px",
                          textTransform: "uppercase", backgroundColor: eventState.event.backgroundColor, color: "white"}}>
                      {eventState.event.extendedProps.category}
                    </div>
                    {/* category tag */}
                    {eventState.event.extendedProps.isPayment ? 
                      <h6 className="left-align">Payment amount: <span style={{color: "maroon", fontWeight:"600"}}>{eventState.event.extendedProps.amount ? "$"+formatNumber(eventState.event.extendedProps.amount) : null}</span></h6>
                      :
                      <h6 className="left-align">Income amount: <span style={{color: "darkgreen", fontWeight:"600"}}>{eventState.event.extendedProps.amount ? "$"+formatNumber(eventState.event.extendedProps.amount) : null}</span></h6>
                    }
                    <h6 className="left-align">URL: {
                      eventState.event.extendedProps.url ? 
                      <a href={eventState.event.extendedProps.url} target="_blank">
                      {eventState.event.extendedProps.url}</a> : 
                      <span className="grey-text text-darken-2">No website provided.</span>
                      }
                    </h6>
                  </div>
                  <div className="left col s12 m6 l6 green lighten-4">
                    {
                      eventState.event.extendedProps.frequency ==="once" ?
                        <div>
                          <h6 style={{fontWeight:"600"}}>~Group Info~</h6>
                          <h6>Single Event</h6>
                        </div>
                        :
                      <div>
                        <h6 style={{fontWeight:"600"}}>~Group Info~</h6>
                        <h6>{"#" + eventState.event.extendedProps.eventNumber + " of " + eventState.event.extendedProps.groupTotal + " occurrences"}</h6>
                        <h6 className="left-align">Group Frequency: <span style={{textTransform: "capitalize"}}>{eventState.event.extendedProps.frequency}</span></h6>
                        <h6 className="left-align">Group Start Date: {moment(eventState.event.extendedProps.groupStartDate).format("MM-DD-YYYY")}</h6>
                        <h6 className="left-align">Group End Date: {moment(eventState.event.extendedProps.groupEndDate).format("MM-DD-YYYY")}</h6>
                      </div>
                    }
                  </div>
                  
                  <div id="modalDivider" className="col s12 m12 l12"
                    style={{
                      width: "100%", height: "4px", 
                      borderTopWidth:"1px", borderTopColor:"purple", borderTopStyle: "solid",
                      borderBottomWidth:"1px", borderBottomColor:"purple", borderBottomStyle:"solid",
                      marginTop: "10px", marginBottom:"10px"
                      }}>
                  </div>

                  <div className="left col s12 m12 l12 blue darken-1 white-text" style={{marginTop:"5px", marginBottom:"0px", borderStyle:"double"}}>
                    {/* <div className="row left"> */}
                      <h6>{"Notes: "}</h6>
                      <div>{eventState.event.extendedProps.notes ? eventState.event.extendedProps.notes 
                        : <span className="grey-text text-darken-4">No notes were added to this event. Use the Calendar to add notes to this event or group.</span>
                        }
                      </div>
                    {/* </div> */}
                  </div>
                </div>
              </div> {/* END OF CARD BODY */}
          </Modal>
        </div>

      </div> {/* END CONTAINER */}
    </>
  )
}
export default MyStatement