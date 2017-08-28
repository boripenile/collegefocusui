import axios from 'axios'
import { Loading } from 'quasar'

let loadFunction = config => {
  Loading.show()
  return config
}
let finishFunction = response => {
  Loading.hide()
  return response
}
let errorFunction = error => {
  Loading.hide()
  return Promise.reject(error)
}

const axiosInstanceCollege = axios.create({
  baseURL: 'http://localhost:8090/collegefocusws/api/'
})

axiosInstanceCollege.interceptors.request.use(loadFunction)

axiosInstanceCollege.interceptors.response.use(finishFunction, errorFunction)

let clients = {
  $http: {
    get () {
      return {
        college: axiosInstanceCollege
      }
    },
    post () {
      return {
        college: axiosInstanceCollege
      }
    },
    put () {
      return {
        college: axiosInstanceCollege
      }
    },
    patch () {
      return {
        college: axiosInstanceCollege
      }
    },
    delete () {
      return {
        college: axiosInstanceCollege
      }
    }
  }
}

export default (Vue) => {
  Object.defineProperties(Vue.prototype, clients)
}
