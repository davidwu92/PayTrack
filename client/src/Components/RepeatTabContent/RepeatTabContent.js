import React from 'react'
import {
  Row,
  Col,
  TextInput
} from 'react-materialize'

const RepeatTabContent = () => {
  return (
    <>
      <Row>
        <Col>
          <span>Repeat every</span>
        </Col>
        <Col>
          <TextInput />
        </Col>
      </Row>
    </>
  )
}

export default RepeatTabContent