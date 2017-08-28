<template>
  <div class="row text-white justify-center" :class="heightSize">
    <q-card class="card col-xs-10 col-sm-6 col-md-3" id="login">
      <q-card-title class="text-center" :class="finalBgColor">
        <svg id="logo" viewBox="0 0 483 483"
             style="enable-background:new 0 0 460 460;"
             xml:space="preserve" width="128px" height="128px"
             v-html="logoMethod">
        </svg>
        <h4>{{logo}}</h4>
      </q-card-title>
      <q-card-main class="card-content">
        <q-input autofocus required stack-label="Username" type="text" 
          v-model="username" @blur="$v.username.$touch()"
          @keyup.enter="login"
          :error="$v.username.$error"
        />
        <q-input required stack-label="Password" type="password" 
          v-model="password" @blur="$v.password.$touch()"
          @keyup.enter="login"
          :error="$v.password.$error"/>
      </q-card-main>
      <q-card-separator></q-card-separator>
      <q-card-actions>
        <q-btn color="teal" class="full-width" @click="login">Login</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script type="text/javascript">
  /* eslint-disable */
  import { mapGetters, mapMutations } from 'vuex'
  import { required } from 'vuelidate/lib/validators'
  import Vivus from 'vivus'
  import logoData from './logoData'
  import { Toast,
           QCard, 
           QCardTitle, 
           QCardMain,
           QCardSeparator,
           QCardActions,
           QInput,
           QBtn} from 'quasar'
  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QCardActions,
      QInput,
      QBtn
    },
    mounted () {
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
      this.setUser(null)
      this.setRoles(null)
      this.setPermissions(null)
      this.setToken(null)
      this.startAnimation()
    },
    beforeDestroy () {
      this.setLayoutNeeded(true)
      this.setIsLoginPage(false)
    },
    computed: {
      ...mapGetters(['getLayoutNeeded', 'getMenuCollapse', 'getToken', 'getUser',
        'getRoles', 'getPermissions']),
      heightSize (){
        if (this.$q.platform.is.desktop) {
          return 'items-center'
        }
        return ''
      },
      finalBgColor () {
        return `bg-${this.bgColor}-${this.toneColor}`
      },
      logoMethod () {
        return logoData[this.logo]
      }
    },
    data () {
      return {
        logos: Object.keys(logoData),
        logo: 'CollegeFocus',
        username: '',
        password: '',
        bgColor: 'teal',
        toneColor: 7,
        colors: ['purple', 'blue', 'red', 'teal', 'amber'],
        colorTones: ['2', '4', '6', '8', '10'],
        buttonClasses: ['normal','outline', 'clear', 'push', 'bordered', 'round'],
        buttonClass: 'normal',
        errorInput: {
          message: 'Username and password are required.'
        },
        vivus: ''
      }
    },
    validations: {
      username: { required  },
      password: { required }
    },
    methods: {
      ...mapMutations(['setLayoutNeeded', 'setIsLoginPage', 'setToken',
        'setPermissions', 'setUser', 'setRoles', 'setPermissions']),
      login () {
        if (this.$v.password.$error) {
          Toast.create.negative({html: this.errorInput.message})
          return
        }
        if (this.$v.username.$error) {
          Toast.create.negative({html: this.errorInput.message})
          return
        }
        var username = this.username
        var password = this.password
        this.$http.college.post('users/login', {
          username, password
        }, null).then(response => {
          if (response.data.data.access_token) {
            var data = response.data
            console.log('Data ', data)
            Toast.create.positive('You are logged in')
            var token = 'Bearer ' + data.data.access_token
            this.setToken(token)
            this.setUser(data.data.user.info)
            this.setRoles(data.data.user.roles)
            this.setPermissions(data.data.user.perms)
            this.setLayoutNeeded(true)
            this.setIsLoginPage(false)
            this.$router.push('/dashboard')
          } 
        }).catch(error => {
          Toast.create.negative('Invalid Username or password')
          this.$router.push('/')
        })  
      },
      startAnimation () {
        this.vivus = new Vivus('logo', {
            duration: 400,
          forceRender: false
          }, function(element) {
            for (let item of element.el.children[0].children) {
              item.setAttribute('style', 'fill:white')
              item.setAttribute('style', 'fill:white')
            }
          }
        )
      }
    }
  }
</script>
<style scoped lang="stylus">
  .q-card {
    margin: 0 auto;
    margin-top: 30px;
  }
  .card-content {
    min-height: 160px;
  }
  button {
    margin-bottom: 4%;
  }
  h4 {
    font-weight: 300;
  }
  .q-btn {
    margin: 10px;
    margin-bottom: 20px;
    padding: 12px;
  }
  .q-card-actions {
    background-color: #FAFAFA;
  }
  
</style>
