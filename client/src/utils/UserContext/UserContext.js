import { createContext } from 'react'

const UserContext = createContext({
  username: '',
  email: '',
  payments: [],
  handleInputChange: () => { },
  handleFormSubmit: () => { }
})

export default UserContext