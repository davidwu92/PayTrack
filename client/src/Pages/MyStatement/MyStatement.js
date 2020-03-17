import React, { useState, useEffect } from 'react'
import UserAPI from '../../utils/UserAPI'
import EventAPI from '../../utils/EventAPI'
import moment from 'moment'
import { greatestDurationDenominator } from '@fullcalendar/core'

const {getColors} = UserAPI
const {getEvents} = EventAPI

const MyStatement = () => {
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
  //Show ALL Categories
  const allCategories = () => {
    let allTrue = [true, true, true, true, true, true, true, true]
    setCategoryState({array: allTrue})
    getTableData({categoryFilter: allTrue, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }
  //Show NO Categories
  const noCategories = () => {
    let allFalse = [false, false, false, false, false, false, false, false]
    setCategoryState({array: [false, false, false, false, false, false, false, false]})
    getTableData({categoryFilter: allFalse, monthFilter: timeState.monthDisplayed, yearFilter: timeState.yearDisplayed})
  }

  //FILTERING BY TIME
  const [timeState, setTimeState] = useState({
    monthDisplayed: 12, //defaults to showing whole year.
    yearDisplayed: "all years", //defaults to showing all years.
  })
  const monthSelect = () => {
    let month = document.getElementById("monthSelect").value
    console.log(month)
    setTimeState({...timeState, monthDisplayed: month})
    getTableData({categoryFilter: categoryState.array, monthFilter: month, yearFilter: timeState.yearDisplayed})
  }
  const yearSelect = () =>{
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
          ||(event.category=="other" && filters.categoryFilter[7])
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

  //testing button
  const seeTableState = () =>{
    console.log(tableState)
    console.log(timeState)
  }

  return (
    <>
      <div className="container">
        <button onClick={seeTableState}>TABLE STATE</button>
        <h1 className="center">Income Expense Statement</h1>
        <div className="row">
          {/* CATEGORY SELECTOR */}
          <div className="center input-field col s12 m6 l6">
            <h5>Toggle Categories</h5>
            <button className="btn-small" onClick={toggleCategory} name="0"
              style={categoryState.array[0] ? {margin: "3px", backgroundColor: tableState.colorPreferences[0]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[0]}}>
                HOUSING</button>
            <button className="btn-small"
              onClick={toggleCategory} name="1" style={categoryState.array[1] ? {margin: "3px", backgroundColor: tableState.colorPreferences[1]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[1]}}>
                INSURANCE</button>
            <button className="btn-small" onClick={toggleCategory} name="2"
              style={categoryState.array[2] ? {margin: "3px", backgroundColor: tableState.colorPreferences[2]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[2]}}>
                LOAN</button>
            <button className="btn-small" onClick={toggleCategory} name="3"
              style={categoryState.array[3] ? {margin: "3px", backgroundColor: tableState.colorPreferences[3]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[3]}}>
                TAXES</button>
            <button className="btn-small" onClick={toggleCategory} name="4"
              style={categoryState.array[4] ? {margin: "3px", backgroundColor: tableState.colorPreferences[4]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[4]}}>
                FAMILY</button>
            <button className="btn-small" onClick={toggleCategory} name="5"
              style={categoryState.array[5] ? {margin: "3px", backgroundColor: tableState.colorPreferences[5]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[5]}}>
                RECREATION</button>
            <button className="btn-small" onClick={toggleCategory} name="6"
              style={categoryState.array[6] ? {margin: "3px", backgroundColor: tableState.colorPreferences[6]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[6]}}>
                INCOME</button>
            <button className="btn-small" onClick={toggleCategory} name="7"
              style={categoryState.array[7] ? {margin: "3px", backgroundColor: tableState.colorPreferences[7]} 
              : {margin: "3px", backgroundColor: "ghostwhite", color: tableState.colorPreferences[7]}}>
                OTHER</button>
            <div className="row">
              <div className="center col s6 m6 l6">
                <button onClick={allCategories} className="btn purple" style={{margin:"3px"}}>ALL</button>
              </div>
              <div className="center col s6 m6 l6">
                <button onClick={noCategories} className="btn white purple-text" style={{margin:"3px"}}>NONE</button>
              </div>
            </div>
          </div>

          {/* YEAR SELECTOR */}
          <div className="center input-field col s4 m2 l2">
            <h5>Select Year</h5>
              <select id="yearSelect" className="browser-default" onChange={yearSelect}>
                <option value={"all years"} selected>All Time</option>
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
                    {/* MONTH SELECTOR */}
                    <div className="center input-field col s8 m4 l4">
            <h5>Select Month</h5>
              <select id="monthSelect" className="browser-default" onChange={monthSelect}>
                {
                  timeState.yearDisplayed === "all years" ? 
                  <><option value="12" selected>See all months in {timeState.yearDisplayed}</option>
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

        {/* INCOME/EXPENSE TABLE */}
        <div className="row grey lighten-3">
          <h5 className="center">Monthly Budget (March)</h5>
          <table className="centered highlight responsive-table">
            <thead>
              <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Expense</th>
                  <th>Income</th>
                  <th>Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              {tableState.events.map((event, i)=>
                  event.extendedProps.isPayment? 
                  (
                  <tr>
                    <td>{moment(event.date).format('dddd MMMM Do, YYYY')}</td>
                    <td>{event.title}</td>
                    <td><div style={{textTransform: "uppercase", backgroundColor: event.backgroundColor, color: "white"}}>{event.extendedProps.category}</div></td>
                    <td>{"$" + event.extendedProps.amount}</td>
                    <td></td>
                    <td>{tableState.cumSum[i]}</td>
                  </tr>):
                  (<tr>
                    <td>{moment(event.date).format('dddd MMMM Do, YYYY')}</td>
                    <td>{event.title}</td>
                    <td><div style={{textTransform: "uppercase", backgroundColor: event.backgroundColor, color: "white"}}>{event.extendedProps.category}</div></td>
                    <td></td>
                    <td>{"$" + event.extendedProps.amount}</td>
                    <td>{tableState.cumSum[i]}</td>
                  </tr>)
                )}
            </tbody>
          </table>
        </div>

      </div> {/* END CONTAINER */}
    </>
  )
}
export default MyStatement