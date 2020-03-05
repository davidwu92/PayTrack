import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import UserAPI from '../../utils/UserAPI'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { loginUser, getUser } = UserAPI

const LogIn = () => {
  let history = useHistory()

  //State Vars for Login Page
  const [loginState, setLoginState] = useState({
    username: '',
    password: ''
  })
  loginState.handleInputChange = (event) => {
    setLoginState({ ...loginState, [event.target.name]: event.target.value })
  }

  //configure error message.
  toast.configure();
  const loginErrorOptions = {
    autoClose: 7000,
    hideProgressBar: true,
    type: "error"
  }

  //defining function for LOG IN button.
  loginState.handleLogin = (event) => {
    event.preventDefault()
    loginUser({
      username: loginState.username,
      password: loginState.password
    })
      .then(({ data }) => {
        // grabbing this before setting it to call getUser
        let tempToken = data.token
        if (data.token && loginUser) {
          localStorage.setItem('token', data.token)
          // get userId to set up LoggedinNavbar for friends request
            getUser(tempToken)
              .then(({ data }) => {
              localStorage.setItem('userId', data._id)
          })
          .then(() => {
            history.push('/mycalendar')
          })
          .catch(e => console.error(e))
        } else {
          // ALERT MESSAGE
          return(toast(`Login failed. Please check your username and password combination.`, loginErrorOptions))
        }
      })
      .catch(e => console.error(e))
  }
  
  //~~~~~"FRONT END" STUFF~~~~~
  return (
    <>
    <div className="row">
      <form action="" className="col s12">
        <h3 className="white-text center-align">Login</h3>
        <div className="container">
          <div className="input-field">
            <input className="white-text" placeholder="Username" type="text" id="username" name="username" value={loginState.username} onChange={loginState.handleInputChange} />
            <label htmlFor="username"></label>
          </div>
          <div className="input-field">
            <input className="white-text"  placeholder="Password" type="password" id="password" name="password" value={loginState.password} onChange={loginState.handleInputChange} />
            <label htmlFor="password"></label>
          </div>
          <button onClick={loginState.handleLogin} id="login" className="btn black waves-effect waves-light col s12 hoverable" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
          </button>
          <br></br>
          <br></br>
          <h6><Link to="/register">CREATE AN ACCOUNT</Link></h6>
          {/* <h6><Link to="/forgotPassword">Forgot Password?</Link></h6> */}
        </div>
      </form>
    </div>
    </>
  )
}

export default LogIn