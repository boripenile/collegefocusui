<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" color="teal" class="glossy" v-show="getLayoutNeeded">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        CollegeFocus
        <div slot="subtitle">v1.1</div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left" v-if="getLayoutNeeded">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
      <div class="row" id="profile">
      <!-- <img :src="photo" style='height: 80px' class="inline-block"> -->
          <div class="col-4">
          <img src="./assets/img/avatar-1.svg" id="avatar" class="inline-block"> 
          </div>
          <!-- <div class="row"> -->
          <div class="col-8" id="user-name">
              <span class="text-black"> {{ getUser.username }} </span>
              <hr>
              <span class="text-black"> {{ getUser.email }} </span>
              <hr>
          </div>
      </div>
      <q-fab
          color="teal"
          icon="keyboard_arrow_right"
          direction="right"
          class="pad">
          <q-fab-action
            class="white"
            @click="logOut"
            icon="person"
          >
          <q-tooltip anchor="center left" self="center right" :offset="[0, 10]">Profile</q-tooltip>
          </q-fab-action>
          <q-fab-action
            class="white"
            @click="logOut"
            icon="alarm"
          >
          <q-tooltip anchor="center left" self="center right" :offset="[0, 10]">Log Out</q-tooltip>
          </q-fab-action>
        </q-fab>
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
      'getRoles', 'getPermissions'])
  },
  methods: {
    ...mapMutations(['setLayoutNeeded', 'setIsLoginPage',
      'setToken', 'setPermissions', 'setUser', 'setRoles']),
    logOut () {
      console.log('User', JSON.stringify(this.getUser))
      this.setUser(null)
      this.setToken(null)
      this.setRoles(null)
      this.setPermissions(null)
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
      this.$router.push('/')
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
  #avatar{
    padding: 20px;
  }
  #profile {
    height: 80px;
    background-color: #FAFAFA;
  }
  #user-name {
    margin-top: 15px;
    width: 159px;
  }
  .pad {
    padding: 15px;
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
  /* .q-card {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  } */
</style>
