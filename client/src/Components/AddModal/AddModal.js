import React from 'react'
import {
  Modal,
  Button,
  TextInput
} from 'react-materialize'

const AddModal = () => {
  return (
    <Modal
      actions={[
        <Button flat modal="close" node="button" waves="green">
          Close
        </Button>
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header="Modal Header"
      id="add-modal"
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%'
      }}
      trigger={<Button node="button">MODAL</Button>}
    >
      <p>Hello World!!</p>
      <form>
        <TextInput placeholder="Title" />
        <TextInput placeholder="Amount" />
        <TextInput placeholder="Frequency" />
        <TextInput placeholder="Website" />
        <TextInput placeholder="Category" />
        <TextInput placeholder="Notes" />
        <TextInput placeholder="Date" />
      </form>
    </Modal>
  )
}

export default AddModal