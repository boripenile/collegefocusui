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

const axiosInstanceGeo = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/'
})

const axiosInstanceCountry = axios.create({
  baseURL: 'https://restcountries.eu/rest/v2/'
})

const axiosInstanceRegion = axios.create({
  baseURL: 'https://battuta.medunes.net/api/region/'
})

const axiosInstanceCity = axios.create({
  baseURL: 'https://battuta.medunes.net/api/city/'
})

axiosInstanceCollege.interceptors.request.use(loadFunction)
axiosInstanceCountry.interceptors.request.use(loadFunction)
axiosInstanceRegion.interceptors.request.use(loadFunction)
axiosInstanceCity.interceptors.request.use(loadFunction)
axiosInstanceGeo.interceptors.request.use(loadFunction)

axiosInstanceCollege.interceptors.response.use(finishFunction, errorFunction)
axiosInstanceCountry.interceptors.response.use(finishFunction, errorFunction)
axiosInstanceRegion.interceptors.response.use(finishFunction, errorFunction)
axiosInstanceCity.interceptors.response.use(finishFunction, errorFunction)
axiosInstanceGeo.interceptors.response.use(finishFunction, errorFunction)

let clients = {
  $http: {
    get () {
      return {
        college: axiosInstanceCollege,
        country: axiosInstanceCountry,
        geo: axiosInstanceGeo,
        region: axiosInstanceRegion,
        city: axiosInstanceCity
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
