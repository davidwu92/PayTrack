import React, { useState } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
// import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'

// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './myCalendar.css'


const MyCalendar = () => {
  return(
    <>
      <h1>My Calendar View</h1>
      <button>Create a Payment Schedule</button>
      
      <p>Here we see the calendar (monthly) that color-codes and displays all your upcoming scheduled payments.</p>
    </>
  )
}

export default MyCalendar