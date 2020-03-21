import React from 'react'
import calendarHelp from './CalendarHelp.png'
import statementsHelp from './StatementsHelp.png'
import chartsHelp from './ChartsHelp.png'

const Help = () => {

  return(
    <>
      {/* <div className="container"> */}
        <h2 className="center white-text">Help</h2>
        <h6 className="center white-text">Quick explanations for features and functions.</h6>

        <div className="row red" style={{padding:"10px", marginBottom:"0px"}}>
          <h4 className="center white-text">Events and Event Groups Tips</h4>
          <h6 className="left white-text">1. Events must be created with a non-negative amount value, but the amount can be set to zero if you wish to create a non-financial calendar event.</h6>
          <h6 className="left white-text">2. Event groups are created from the given title. Make sure any new events you add don't have the same title!</h6>
          <h6 className="left white-text">3. Changing the date of a single event or deleting a single event will not affect the GROUP START DATE, GROUP END DATE, event number, or group total. These can only be changed by editing the entire group of events.</h6>
        </div>

        <div className="row green lighten-1" style={{padding:"10px", marginBottom:"0px"}}>{/* CALENDAR PAGE */}
          <h4 className="center white-text">My Calendar Page</h4>
          <h6 className="center white-text">This is the only page where your calendar events can be added, edited, or deleted.</h6>
          <div className="col s12 m6 l6 center">
            <img src={calendarHelp} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"40vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
          <div className="col s12 m6 l6 left">
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"A"}</span>
              <span> </span>Click to add events or groups of events. Events must have a date, non-negative dollar amount, and unique title. If no category is selected, event/event group will default to "Other".
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"B"}</span>
              <span> </span>Use this tool to customize your categories' colors. Your color preferences will be saved and applied across the entire app.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"C"}</span>
              <span> </span>Click these buttons to change the month and year viewed on the calendar.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"D"}</span>
              <span> </span>Click an event to view details, edit, or delete the event/event group. You can drag and drop events to quickly move entire groups. Click on a calendar day to quickly add a single event (you cannot add an event group this way.)
            </h6>
            <br></br>
          </div>
        </div>
        
        <div className="row blue lighten-1" style={{padding:"10px", marginBottom:"0px"}}>{/* STATEMENTS PAGE */}
          <h4 className="center white-text">My Statements Page</h4>
          <h6 className="center white-text">The statement seen is created using data from your calendar events. You must add events on the Calendar page for this tool to be of use.</h6>
          <div className="col s12 m6 l6 center">
            <img src={statementsHelp} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"40vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
          <div className="col s12 m6 l6 left">
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"E"}</span>
              <span> </span>Year Select will limit the events calculated in your statement to the selected year; likewise for Month Select. A year must be selected in order to choose a month.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"F"}</span>
              <span> </span>Category Buttons allow you to toggle which categories are represented in the statement. "All" will turn on all categories, while "None" will turn off all categories (emptying all events from your statement)
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"G"}</span>
              <span> </span>The statement shows events in chronological order. Titles of grouped events also include (event number/total events in group). Clicking an event will show the event and event group details, but events cannot be edited or deleted from this page.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"H"}</span>
              <span> </span>The last row of the statement calculates the range of event dates, the total number of events on the statement, and grand totals for Income, Expense, and Balance.
            </h6>
            <br></br>
          </div>
        </div>

        <div className="row pink" style={{padding:"10px", marginBottom:"0px"}}>{/* CHARTS PAGE */}
          <h4 className="center white-text">My Charts Page</h4>
          <h6 className="center white-text">Like the Statements page, your charts are created using data from your calendar events.</h6>
          <div className="col s12 m6 l6 center">
            <img src={chartsHelp} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"40vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
          <div className="col s12 m6 l6 left">
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"J"}</span>
              <span> </span>The color palette here is the same as the one in the My Calendar page; it acts as both a color key for charts and the category color customizing tool, so changes made to colors here will apply across all pages.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"K"}</span>
              <span> </span>Use the purple and green buttons to select which month's and year's event data to use for the charts.
            </h6>
            <br></br>
            <h6 className="white-text">
              <span style={{padding:"0px 8px 0px 8px"}}className="black">{"L"}</span>
              <span> </span>The line graph displays each month's total income, expenses, and balance (the difference between the two). Months are numbered such that 1 is January, 2 is February, and so on.
            </h6>
            <br></br>
          </div>
        </div>

      {/* </div> */}
    </>
  )
}
export default Help