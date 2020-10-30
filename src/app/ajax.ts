import Axios from 'axios'

const ajax = Axios.create({
  baseURL: (process.env.NODE_ENV == "production"
    ? "/api"
    : "http://localhost:3000")
})

export default ajax