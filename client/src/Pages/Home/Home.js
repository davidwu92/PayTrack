//Pages/Home.js LANDING PAGE
import React from 'react'
import { useHistory } from 'react-router-dom'
import './home.css'

const Home = () => {
  const history = useHistory()

  const toLoginPage = () => {
    history.push('/login')
  }

  return (
    <>
      <div className="white-text container center-align">
        <h2 className="white-text">Welcome to PayTrack</h2>
        <h5 className="white-text">The ultimate calendar-based budgeting app.</h5>
        <div className="row left-align">
          <div className="col s12 m4 l4">
            <h6>Track recurring or one-time payments on a customizable, color-coded budget calendar.</h6>
          </div>
          <div className="col s12 m4 l4">
            <h6>See automatically generated monthly, yearly, and/or category-based statements summarizing your expenditures and income.</h6>
          </div>
          <div className="col s12 m4 l4">
            <h6>Have access to graphs and charts of your financial activity.</h6>
          </div>
        </div>
        <button className="btn btn-large purple"onClick={toLoginPage}>Get Started</button>
      </div>
    </>
  )
}
export default Home