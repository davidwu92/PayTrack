import React from 'react'
import {
  Modal,
  Button,
  Tabs,
  Tab
} from 'react-materialize'

import MainTabContent from '../MainTabContent'

const AddModal = () => {
  return (
    <Modal
      actions={[
        <Button
          modal="close"
          node="button"
          waves="green"
          style={{ marginRight: '5px' }}
        >
          Add
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="red"
        >
          Cancel
        </Button>
      ]}
      bottomSheet={true}
      fixedFooter={false}
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
      <form>
        <Tabs
          className="z-depth-1 tabs-fixed-width"
        >
          <Tab
            active
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Main"
          >
            <MainTabContent />
          </Tab>
          <Tab
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Repeat"
          >
            <h1>Repeat</h1>
          </Tab>
          <Tab
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Optional"
          >
            <h1>Optional</h1>
          </Tab>
        </Tabs>
      </form>
    </Modal>
  )
}

export default AddModal