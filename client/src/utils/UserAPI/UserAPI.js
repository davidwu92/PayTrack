import axios from 'axios'

const UserAPI = {
  
  //login existing user.
  loginUser: (user) => axios.post('/login', user),

  //Register new user
  addUser: (user) => axios.post('/users', user),

  //to get info on logged-in user.
  getUser: (token) => axios.get('/users', {
      headers: {
        "Authorization": "Bearer " + token}
    }),
    
  //edit profile
  // updateUser: (id, values) => axios.put(`/users/${id}`, values),

  //PAYMENT STUFF
  addEvent: (token, event) => axios({
    method: 'post',
    url: '/events',
    data: {
      title: event.title,
      groupId: event.groupId,
      amount: event.amount,
      isPayment: event.isPayment,
      frequency: event.frequency,
      website: event.website,
      category: event.category,
      notes: event.notes,
      startingDate: event.startingDate
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  getEvent: (token) => axios({
    method: 'get',
    url: '/events',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  deleteEvent: (token, id) => axios({
    method: 'delete',
    url: '/events',
    data: {
      _id: id
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

}

export default UserAPI
