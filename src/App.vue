<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-1': true}"
  >
    <q-toolbar slot="header" color="teal" v-if="getUser">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title v-if="schoolName">
        {{ schoolName }}
      </q-toolbar-title>
      <q-toolbar-title v-else>
        CollegeFocus Super
        <div slot="subtitle">v1.1</div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left" v-if="getUser">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
      <div class="row justify-center" v-if="getUser">
          <div class="col-xs-12 col-sm-12 col-md-12 text-center">
            <q-icon name="account_circle" style="font-size: 90px; color: #A0A0A0;" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 text-center">
            Welcome <h5>{{ getUser.username }}</h5>
          </div>
      </div>
      <div class="row justify-center" v-if="getUser">
        <q-btn
            class="white pad"
            round
            @click="profile"
            icon="person"
          >
          <q-tooltip anchor="center left" self="center right" :offset="[0, 10]">Profile</q-tooltip>
          </q-btn>
          <q-btn
            class="white"
            round
            @click="logOut"
            icon="exit_to_app"
          >
          <q-tooltip anchor="center left" self="center right" :offset="[0, 10]">Log Out</q-tooltip>
          </q-btn>
      </div>
      <app-menu :links="links"></app-menu>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <q-transition name="custom">
      <router-view ></router-view>
    </q-transition>
  </q-layout>
  </div>
</template>

<script>
import {
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QFab,
  QFabAction,
  QTooltip,
  QTransition
} from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
import AppMenu from 'components/Menu'
import Menus from 'configs/menus'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QFab,
    QFabAction,
    QTooltip,
    QTransition,
    AppMenu
  },
  data () {
    return {
      orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
      rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
      moveX: 0,
      moveY: 0,
      rotateY: 0,
      rotateX: 0,
      links: Menus
    }
  },
  computed: {
    ...mapGetters(['getLayoutNeeded', 'getMenuCollapse', 'getToken', 'getUser',
      'getRoles', 'getPermissions']),
    schoolName () {
      console.log('Here...')
      if (this.getUser) {
        if (this.getUser.school) {
          var school = this.getUser.school
          console.log('School...: ', school)
          return school.schoolName
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setLayoutNeeded', 'setIsLoginPage',
      'setToken', 'setPermissions', 'setUser', 'setRoles', 'setAcademicSession']),
    logOut () {
      console.log('User', JSON.stringify(this.getUser))
      this.setUser(null)
      this.setToken(null)
      this.setRoles(null)
      this.setPermissions(null)
      this.setAcademicSession(null)
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
      this.$router.replace('/')
    },
    profile () {
      this.$router.replace('/profile')
    },
    launch (url) {
      openURL(url)
    },
    orient (evt) {
      if (evt.beta === null || evt.gamma === null) {
        window.removeEventListener('deviceorientation', this.orient, false)
        this.orienting = false

        window.addEventListener('devicemotion', this.rotate, false)
      }
      else {
        this.rotateX = evt.beta * 0.7
        this.rotateY = evt.gamma * -0.7
      }
    }
  },
  mounted () {
    // this.setSchoolName()
    this.$nextTick(() => {
      if (this.orienting) {
        window.addEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.addEventListener('devicemove', this.rotate, false)
      }
      else {
        document.addEventListener('mousemove', this.move)
      }
    })
  },
  beforeDestroy () {
    this.setLayoutNeeded(false)
    this.setIsLoginPage(true)
    this.setRoles(null)
    this.setPermissions(null)
    this.setAcademicSession(null)
    this.setUser(null)
    this.setToken(null)
    if (this.orienting) {
      window.removeEventListener('deviceorientation', this.orient, false)
    }
    else if (this.rotating) {
      window.removeEventListener('devicemove', this.rotate, false)
    }
    else {
      document.removeEventListener('mousemove', this.move)
    }
  }
}
</script>

<style>
  #q-app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .pad {
    margin-right: 15px;
  }
  .custom-enter-active {
    transition: all .3s ease;
  }
  .custom-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .custom-enter, .custom-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
  .my-label {
    padding: 5px;
    border-radius: 3px;
    display: inline-block;
  }
  /* .q-card {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  } */
</style>
