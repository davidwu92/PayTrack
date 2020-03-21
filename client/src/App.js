import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Navbar from './Components/Navbar'
import LoggedInNav from './Components/LoggedInNav'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import MyCalendar from './Pages/MyCalendar'
import MyCharts from './Pages/MyCharts'
import MyStatement from './Pages/MyStatement'
import Help from './Pages/Help'

// import UserContext from './utils/UserContext'
import './app.css'

function App() {

  return (
    // <UserContext.Provider value={userState}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Navbar/>
            <Home />
          </Route>
        </Switch>
        
        <Switch>
          <Route exact path="/login">
            <Navbar/>
            <Login />
          </Route>
        </Switch>
        
        <Switch>
          <Route exact path="/register">
            <Navbar/>
            <Register />
          </Route>
        </Switch>
        
        <Switch>
          <Route exact path="/mycalendar">
            <LoggedInNav/>
            <MyCalendar />
          </Route>
        </Switch>

        <Switch>
          <Route exact path="/mycharts">
            <LoggedInNav/>
            <MyCharts />
          </Route>
        </Switch>

        <Switch>
          <Route exact path="/mystatement">
            <LoggedInNav/>
            <MyStatement />
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/help">
            <LoggedInNav/>
            <Help />
          </Route>
        </Switch>

      </Router>
    // </UserContext.Provider>
  );
}

export default App;
