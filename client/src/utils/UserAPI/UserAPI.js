import axios from 'axios'

const UserAPI = {
  
  //login existing user.
  loginUser: (user) => axios.post('/login', user),

  //Register new user
  addUser: (user) => axios.post('/users', user),

  //to get info on logged-in user. Not needed or used atm.
  getUser: (token) => axios.get('/users', {
      headers: {
        "Authorization": "Bearer " + token}
    }),


  //GRAB color preferences of user.
  getColors: (token) => axios.get('/users', {
      headers: {
        "Authorization": "Bearer " + token}
    }),

  //edit user category color preferences
  editColors: (id, values) => axios.put(`/users/${id}`, values),
}

export default UserAPI
