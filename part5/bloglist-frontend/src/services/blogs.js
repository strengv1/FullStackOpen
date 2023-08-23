import axios from 'axios'
const baseUrl = '/api/blogs'

const create = (newObject, user) => {
  let config = {
    headers: {
      Authorization: 'bearer ' + user.token,
    }
  }  
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, create }