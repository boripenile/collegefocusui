import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'configs/store'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => System.import(`components/${component}.vue`)
}

var router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */
  routes: [
    { path: '/dashboard', name: 'Dashboard', component: load('views/dashboard') },
    { path: '/', name: 'Login', component: load('views/login/login-college') },
    { path: '/roles', name: 'Roles', component: load('views/settings/roles') },
    { path: '/permissions', name: 'Permissions', component: load('views/settings/permissions') },
    { path: '/services', name: 'Services', component: load('views/settings/services') },
    { path: '/features', name: 'Features', component: load('features') },
    { path: '/registration/:type', name: 'Registration', component: load('registration') },
    { path: '/activate/:code', name: 'Activation', component: load('activation') },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ],
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  // window.console.log('Transition', transition)
  var token = store.state.token

  if (to.name === 'Features') {
    next()
  }
  else if (to.name === 'Registration') {
    next()
  }
  else if (to.name === 'Activation') {
    next()
  }
  else if (token === null || token === 'undefined') {
    if (to.name === 'Login') {
      next()
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  }
  else {
    if (to.name === 'Login') {
      next({
        path: '/dashboard',
        query: {redirect: to.fullPath}
      })
    }
    else {
      next()
    }
  }
})
export default router
