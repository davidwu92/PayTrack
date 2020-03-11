import React from 'react'
import {
  Switch,
  TextInput
} from 'react-materialize'

const MainTabContent = () => {
  return (
    <>
      <Switch 
        onLabel="Income"
        offLabel="Payment"
        onChange={() => {}}
      />
      <TextInput
        placeholder="Title"
        name="title"
      />
      <TextInput
        placeholder="Amount"
        name="amount"
        type="number"
      />
    </>
  )
}

export default MainTabContent