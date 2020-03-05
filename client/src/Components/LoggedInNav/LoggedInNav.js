import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './loggedInNav.css'

const LoggedinNav = () => {

  let userId = JSON.parse(JSON.stringify(localStorage.getItem("userId")))

  const logout = (e) => {
    e.preventDefault()
    localStorage.clear('token')
  }

  return (
    <nav id="bottomNav" className="nav-extended black">
      <div className="nav-wrapper" id="navWrapper">
        <div className="brand-logo" id="nav">Harmonize</div>
      </div>
      <div className="nav-content">
        <ul className="tabs tabs-transparent">
          <li id="hovEffect" className="tab left"><Link to="/mycalendar"><i className="fas fa-calendar-alt"></i></Link></li>
          <li id="hovEffect" className="tab"><Link to="/mytotals"><i className="fas fa-wallet"></i></Link></li>
          <li id="hovEffect" className="tab right" onClick={logout}><Link to="/"><i className="fas fa-sign-out-alt"></i></Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default LoggedinNav