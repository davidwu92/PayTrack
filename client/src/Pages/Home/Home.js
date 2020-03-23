//Pages/Home.js LANDING PAGE
import React from 'react'
import { useHistory } from 'react-router-dom'
import './home.css'
import calendarHome from './CalendarHome.png'
import statementsHome from './StatementsHome.png'
import chartsHome from './ChartsHome.png'

const Home = () => {
  const history = useHistory()

  const toLoginPage = () => {
    history.push('/login')
  }

  return (
    <>
      <div className="white-text center-align">
        <div className="row">
          <h2 className="white-text">Welcome to PayTrack</h2>
          <h4 className="white-text">The ultimate calendar-based budgeting app.</h4>
          <button className="btn btn-large purple"onClick={toLoginPage}>Get Started</button>
        </div>
        <div className="row red" style={{padding: "20px", margin:"0px"}}>
          <div className="col s12 m5 l5 center">
            <h5>Track recurring or one-time payments on a customizable, color-coded budget calendar.</h5>
            <h5>Quickly add, edit, and remove groups of recurring financial events.</h5>
          </div>
          <div className="col s12 m7 l7 center-align">
            <img src={calendarHome} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"30vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
        </div>
        <div className="row green" style={{padding: "20px", margin:"0px"}}>
          <div className="col s12 m7 l7 center-align">
            <img src={statementsHome} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"30vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
          <div className="col s12 m5 l5 center">
            <h5>View auto-generated monthly and yearly summaries of your expenditures and income.</h5>
            <h5>Customize which categories, months, or years to omit/include from your statement.</h5>
          </div>
        </div>
        <div className="row blue" style={{padding: "20px", margin:"0px"}}>
          <div className="col s12 m5 l5 center">
            <h5>Generate graphs and charts of your financial activity over time.</h5>
          </div>
          <div className="col s12 m7 l7 center-align">
            <img src={chartsHome} style={window.screen.width < 996 ? {opacity:"0.85",width:"85vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}:{opacity:"0.85", width:"30vw", borderStyle: "outset", borderColor: "lavender", borderRadius:"5%"}}></img>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home