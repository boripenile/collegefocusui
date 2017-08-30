// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import AppView from './App.vue'
import VueRouter from 'vue-router'
import router from 'configs/router'
import axios from 'configs/axios'
import store from 'configs/store'
import Vuelidate from 'vuelidate'

import { mapGetters, mapMutations } from 'vuex'
// import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(Quasar) // Install Quasar Framework
Vue.use(axios)
Vue.use(VueRouter)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    mounted () {
      this.checkUser()
    },
    methods: {
      ...mapMutations(['setLayoutNeeded', 'setIsLoginPage',
        'setToken', 'setPermissions', 'setUser', 'setRoles', 'setPermissions']),
      checkUser () {
        console.log('Token: ', this.getToken)
        var token = this.getToken
        if (token) {
          console.log('I am successful....')
          this.$store.state.user = this.getUser
          this.$router.replace('/dashboard')
        }
        else {
          if (this.$router.name === 'Registration') {
            this.$router.next()
          }
          this.setUser(null)
          this.$router.replace('/')
        }
      }
    },
    computed: {
      ...mapGetters(['getLayoutNeeded', 'getMenuCollapse', 'getToken', 'getUser',
        'getRoles', 'getPermissions'])
    },
    router: router,
    store: store,
    render (h) {
      var logged = this.getToken
      console.log('Logged 1: ' + logged)
      if (logged) {
        console.log('Logged 2 : ', logged)
        this.setLayoutNeeded(true)
        this.setIsLoginPage(false)
      }
      else {
        console.log('Not Logged 3: ', logged)
        this.setLayoutNeeded(false)
        this.setIsLoginPage(true)
      }
      return h(AppView)
    }
    // render: h => h(require('./App'))
  })
})
