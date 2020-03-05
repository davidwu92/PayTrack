//Landing Page
import React from 'react'
import { useHistory } from 'react-router-dom'
import './home.css'

const Home = () => {
  const history = useHistory()
  return (
    <>
      <div className="container center-align">
        <h5 className="white-text">HOME PAGE</h5>
      </div>
    </>
  )
}
export default Home