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
  addPayment: (token, payment) => axios({
    method: 'post',
    url: '/payments',
    data: {
      // title: payment.newTitle,
      // body: payment.newBody,
      // link: payment.newLink
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  getPayment: (token) => axios({
    method: 'get',
    url: '/payments',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }),

  deletePayment: (token, id) => axios({
    method: 'delete',
    url: '/payments',
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
