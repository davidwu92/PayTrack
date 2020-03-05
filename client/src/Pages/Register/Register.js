import React, { useState } from 'react'
// import {useContext} from 'react'
// import UserContext from '../../utils/UserContext'
import UserAPI from '../../utils/UserAPI'
import { useHistory } from 'react-router-dom'
import './register.css'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { addUser } = UserAPI

const RegisterForm = () => {
  const history = useHistory()

  const [registerState, setRegisterState] = useState({
    username: '',
    email: '',
    password: ''
  })

  registerState.handleInputChange = (event) => {
    setRegisterState({ ...registerState, [event.target.name]: event.target.value })
  }

  //configure error message.
  toast.configure();
  const registerToastOptions = {
    autoClose: 5000,
    hideProgressBar: true,
    type: "error"
  }

  // ADD USER/REGISTER BUTTON
  const handleAddUser = event => {
    event.preventDefault()
    addUser({
      username: registerState.username,
      email: registerState.email,
      password: registerState.password,
    })
      .then(({ data }) => {
        if (data === "OK") {
          history.push('/login')
        }
        // else if (data === "password cant be left blank") {
        //   //Error: Password not long enough/missing.
        //   return (toast(`You must provide a password.`, registerToastOptions))
        // } else if (data === 'need more') {
        //   // Error: password not long enough
        //   return (toast(`Your password must be at least 4 characters long.`, registerToastOptions))
        // } else if (data.e.keyValue.username || null) {
        //   //Error: username in use.
        //   return (toast(`That username is already in use.`, registerToastOptions))
        // } else if (data.e.keyValue.email || null) {
        //   //Error: email in use. 
        //   return (toast(`That email is already in use.`, registerToastOptions))
        // } 
          else {
            return(toast(`Error: New user registration failed.`, registerToastOptions))
        }
      })
      .catch(e => console.error(e))
  }

  //INSTRUMENTS, SKILLS VARIABLES:

  return (
    <div className="container">
      <form id="registerForm" action="" className="col s12">
        <h3 className="white-text center">Register</h3>
        {/* USERNAME */}
        <div className="input-field">
          <label htmlFor="username"></label>
          <input className="white-text" placeholder="Username" type="text" id="username" name="username" value={registerState.username} onChange={registerState.handleInputChange} />
        </div>
        {/* EMAIL */}
        <div className="input-field">
          <input className="white-text" placeholder="Email" type="text" id="email" name="email" value={registerState.email} onChange={registerState.handleInputChange} />
          <label htmlFor="email"></label>
        </div>
        {/* PASSWORD */}
        <div className="input-field">
          <input className="white-text" placeholder="Password" type="password" id="password" name="password" value={registerState.password} onChange={registerState.handleInputChange} />
          <label htmlFor="password"></label>
        </div>
        {/* SUBMIT REGISTRATION BUTTON */}
        <button onClick={handleAddUser} id="register" className="btn black waves-effect waves-light col s12 hoverable" type="submit" name="action">Register
              <i className="material-icons right">send</i>
        </button>
      </form>
    </div>
  )
}

export default RegisterForm
