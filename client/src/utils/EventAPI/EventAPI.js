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
      notes: event.notes,
      date: event.date
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
  editEvent: (eventId, values) => axios.put(`/event/${eventId}`, values),

  //EDIT GROUP of events via drag-drop.
  editEvents: (groupId, values) => axios.put(`/events/${groupId}`, values),

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
  deleteEvent: (token, groupId) => axios({
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