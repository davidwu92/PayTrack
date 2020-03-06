import React from 'react'
// import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './loggedInNav.css'

const LoggedinNav = () => {

  // let userId = JSON.parse(JSON.stringify(localStorage.getItem("userId")))

  const logout = (e) => {
    e.preventDefault()
    localStorage.clear('token')
  }

  return (
    <nav id="bottomNav" className="nav-extended black">
      <div className="nav-wrapper" id="navWrapper">
        <div className="brand-logo" id="nav">Payment Tracker</div>
      </div>
      <div className="nav-content">
        <ul className="tabs tabs-transparent">
          <li id="hovEffect" className="tab left"><Link to="/mycalendar">Calendar <i className="fas fa-calendar-alt tiny"></i></Link></li>
          <li id="hovEffect" className="tab"><Link to="/mytotals">Totals <i className="fas fa-wallet tiny"></i></Link></li>
          <li id="hovEffect" className="tab right" onClick={logout}><Link to="/"><i className="fas fa-sign-out-alt"></i></Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default LoggedinNav