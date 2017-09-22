import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

let state = {
  layoutNeeded: true,
  isLoginPage: false,
  mobileMode: false,
  menuCollapse: true,
  posts: [],
  user: {},
  token: null,
  permissions: [],
  roles: [],
  academicSession: {},
  geoApiKey: 'AIzaSyCy_Q5Pdi8jXOf7ew93zOfr99oL77jJnRk',
  countryApiKey: '785caf1227be1502db4107297454cb1d',
  payStackPubKey: 'pk_test_01d27294ef67d16c9e6521c27c3879add1704f1a'
}

let mutations = {
  setAcademicSession (state, value) {
    state.academicSession = value
  },
  setLayoutNeeded (state, value) {
    state.layoutNeeded = value
  },
  setIsLoginPage (state, value) {
    state.isLoginPage = value
  },
  setMobileMode (state, value) {
    state.mobileMode = value
  },
  setMenuCollapse (state, value) {
    state.menuCollapse = value
  },
  setPosts (state, posts) {
    state.posts = posts
  },
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
  },
  setPermissions (state, permissions) {
    state.permissions = permissions
  },
  setRoles (state, roles) {
    state.roles = roles
  },
  setHasSubscription (state, hasSubscription) {
    state.hasSubscription = hasSubscription
  }
}

let getters = {
  getAcademicSession () {
    return state.academicSession
  },
  getPayStackPubKey () {
    return state.payStackPubKey
  },
  getLayoutNeeded () {
    return state.layoutNeeded
  },
  getIsLoginPage () {
    return state.isLoginPage
  },
  getMobileMode () {
    return state.mobileMode
  },
  getMenuCollapse () {
    return state.menuCollapse
  },
  getPosts () {
    return state.posts
  },
  getUser () {
    return state.user
  },
  getToken () {
    return state.token
  },
  getPermissions () {
    return state.permissions
  },
  getRoles () {
    return state.roles
  },
  getHasSubscription () {
    return state.hasSubscription
  },
  getCountryApiKey () {
    return state.countryApiKey
  },
  getGeoApiKey () {
    return state.geoApiKey
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
