import axios from 'axios'

const EventAPI = {
  
  //ADD ONE event.
  addEvent: (token, event) => axios({
    method: 'post',
    url: '/event',
    data: {
      title: event.title,
      groupId: event.groupId,
      amount: event.amount,
      isPayment: event.isPayment,
      frequency: event.frequency,
      website: event.website,
      category: event.category,
      eventDate: event.eventDate,
      groupStartDate: event.groupStartDate,
      groupEndDate: event.groupEndDate,
      eventNumber: event.eventNumber,
      groupTotal: event.groupTotal,
      notes: event.notes,
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  //ADD MANY events. Works fine.
  addEvents: (token, events) => axios({
    method: 'post',
    url: '/events',
    data: events,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    } 
  }),

  //get all events.
  getEvents: (token) => axios({
    method: 'get',
    url: '/events',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  //EDIT ONE event.
  editEvent: (token, eventId, values) => axios({
    method: 'put',
    url: `/event/${eventId}`,
    data: values,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
      }
    }),

  //EDIT GROUP of events
  editEvents: (token, groupId, values) => axios({
    method: 'put',
    url: `/events/${groupId}`,
    data: values,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
      }
    }),

  //DELETE ONE EVENT
  deleteEvent: (token, id) => axios({
    method: 'delete',
    url: '/event',
    data: {
      _id: id
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  //DELETE ONE EVENT
  deleteEvents: (token, groupId) => axios({
    method: 'delete',
    url: '/events',
    data: {
      groupId: groupId
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),
}

export default EventAPI