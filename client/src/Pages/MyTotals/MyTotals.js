import React, { useState } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
// import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'

// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './myTotals.css'
import AddEventModal from '../../Components/AddEventModal'


const MyTotals = () => {

  const [totalState, setTotalState] = useState({
    variable: ''
  })

  return(
    <>
      <h1>My Totals VIEW</h1>
      <AddEventModal />
    </>
  )
}

export default MyTotals