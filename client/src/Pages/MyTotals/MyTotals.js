import React, { useState, useEffect } from 'react'
// import { BrowserRouter as Link } from 'react-router-dom'
// import UserAPI from '../../utils/UserAPI'
// import { useHistory } from 'react-router-dom'

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'

// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './myTotals.css'
import AddEventModal from '../../Components/AddEventModal'


const MyTotals = () => {

  const [totalState, setTotalState] = useState({
    variable: ''
  })

  const [radiiState, setRadiiState] = useState({})

  const data = [
  {name: 'January', uv: 400, pv: 800, amt: 400},
  {name: 'February', uv: 300, pv: 900, amt: 500},
  {name: 'March', uv: 300, pv: 200, amt: 600},
  {name: 'April', uv: 200, pv: 500, amt: 700},
  {name: 'June', uv: 300, pv: 750, amt: 800},
  {name: 'July', uv: 300, pv: 750, amt: 900},
  {name: 'August', uv: 300, pv: 750, amt: 500},
  {name: 'September', uv: 300, pv: 750, amt: 600},
  {name: 'October', uv: 300, pv: 750, amt: 700},
  {name: 'November', uv: 300, pv: 750, amt: 800},
  {name: 'December', uv: 198, pv: 975, amt: 900},]

  let expenses = [
    [{name: 'Car',value: 350,fill: '#8DAA9D'}],
    [{name: 'Personal Loan',value: 400,fill: '#522B47'}],
    [{name: 'Phone',value: 95,fill: '#7B0828'}],
    [{name: 'Navient',value: 150,fill: '#0F0E0E'}],
    [{name: 'Claremont',value: 112,fill: '7B0828'}],
  ]

  let resetRadii = () => {
    let returnVal = {}
    expenses.forEach(expense => {
      returnVal = { ...returnVal, [expense[0].name]: 120 }
    })
    return returnVal
  }

  const income = 2700

  const addAngles = (startAngle, expense) => {
    const endAngle = startAngle + (expense[0].value / income * 360)
    return [{ ...expense[0], startAngle, endAngle }]
  }

  const pieEnter = pie => {
    setRadiiState({ ...resetRadii(), [pie.name]: 140 })
  }

  const pieLeave = pie => {
    setRadiiState({ ...radiiState, [pie.name]: 120 })
  }

  useEffect(() => {
    setRadiiState(resetRadii())
  }, [])

  return(
    <>
      <div className="container">
        <h1 className="center">My Totals VIEW</h1>
        <AddEventModal />
        <LineChart width={600} height={400} data={data} style={{ backgroundColor: '#FFFFFF' }}>
          <CartesianGrid stroke="#ccc" />
          <XAxis datakey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#AA2200" />
          <Line type="monotone" dataKey="pv" stroke="#DDDDDD" />
          <Line type="monotone" dataKey="amt" stroke="#0000FF" />
        </LineChart>

        <PieChart width={600} height={400} style={{ backgroundColor: '#FFFFFF' }}>
          <Tooltip />
          {
            (() => {
              let startAngle = 0
              let withAngles = expenses.map(expense => {
                let expenseWithAngles = addAngles(startAngle, expense)
                startAngle = expenseWithAngles[0].endAngle
                return expenseWithAngles
              })

              let pies = withAngles.map((expense, index) => (
                <Pie 
                  key={index}  
                  data={expense} 
                  dataKey='value' 
                  nameKey='name' 
                  cx='50%' 
                  cy='50%' 
                  outerRadius= {radiiState[expense[0].name]} 
                  label 
                  fill={expense[0].fill} 
                  startAngle={expense[0].startAngle} 
                  endAngle={expense[0].endAngle} 
                  onMouseEnter={pieEnter}
                  onMouseLeave={pieLeave}
                  on />
              ))
              
              console.log(pies) 

              return pies
            })()
          }
        </PieChart>
    </div>
    </>
  )
}

export default MyTotals