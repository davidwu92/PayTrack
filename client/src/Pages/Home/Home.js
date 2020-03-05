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
      <div className="container center-align">
        <h5 className="white-text">HOME PAGE</h5>
        <button onClick={toLoginPage}>Get Started</button>
      </div>
    </>
  )
}
export default Home