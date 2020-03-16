import React, { useState, useEffect } from 'react'
import UserAPI from '../../utils/UserAPI'

import EventAPI from '../../utils/EventAPI'

const {getColors} = UserAPI
const {getEvents} = EventAPI

const MyStatement = () => {
  const [tableState, setTableState] = useState({
    events: [],
    cumulative: [],
  })
  //on pageload, grab color preferences and event data.
  let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
  useEffect(()=>{
    let colorPreferences = []
    getColors(token)
    .then(({data})=>{
      //got color preferences, now need all this user's events.
      console.log(data)
      getEvents(token)
      .then(({data})=>{
        let myEvents=[]
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
            myEvents.sort((a, b)=>(a.date > b.date)? 1:-1)
            myEvents.push(calendarEvent)
          })
        }
        setTableState({...tableState, events: myEvents})
      })
      .catch(e=>console.error(e))
    })
    .catch(e=>console.error(e))
  }, [])

  //testing button
  const seeTableState = () =>{
    console.log(tableState)
  }
  return (
    <>
      <div className="container">
        <h1 className="center">Income Expense Statement</h1>
        {/* CATEGORY SELECTOR */}
        <button onClick={seeTableState}>TABLE STATE</button>
        <div className="row">
          <table className="highlight centered responsive-table">
            <thead>
              <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Piano Lessons 1/5</td>
                <td>3/16/2020</td>
                <td>--</td>
                <td>$40</td>
                <td>$40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> {/* END CONTAINER */}
    </>
  )
}
export default MyStatement