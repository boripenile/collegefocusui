<template>
  <div><q-modal ref="successful" minimized noBackdropDismiss noEscDismiss
    :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
    <q-icon name="check_circle" color="positive" style="font-size: 80px" />
    <br>
    <h5>{{ title }}</h5>
    <h6>{{ subtitle }}</h6>
    <strong>
      <small class="text-primary">{{ content }}</small>
    </strong>
    <br>
    <small class="text-negative">We are committed to simplify your educational processes and management.</small>
    <br><br>
    <q-btn color="teal" @click="closeSuccessful">{{ link }}</q-btn>
  </q-modal>
  <q-modal ref="failure" minimized noBackdropDismiss noEscDismiss
    :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
    <q-icon name="cancel" color="negative" style="font-size: 80px" />
    <br>
    <h5>Verification failed</h5>
    <br>
    <strong>
      <small class="text-negative">We are unable to verify your registration or the link has expired.</small>
    </strong>
    <br>
    <br><br>
    <q-btn color="teal" @click="closeFailure">Ok</q-btn>
  </q-modal></div>
</template>

<script>
import { QModal, QBtn, QIcon } from 'quasar'
export default {
  data () {
    return {
      verified: false,
      code: this.$route.params.code,
      title: 'Registration verified',
      subtitle: '',
      content: '',
      link: 'Proceed to login'
    }
  },
  components: {
    QModal,
    QBtn,
    QIcon
  },
  methods: {
    closeSuccessful () {
      this.$refs.successful.close()
      if (this.verified) {
        this.$router.replace('/')
      }
    },
    closeFailure () {
      this.$refs.failure.close()
      this.$router.replace('/')
    },
    verifyCode () {
      console.log('Code: ' + this.code)
      this.$http.college.post('schools/activate/' + this.code).then(response => {
        console.log('Received: ', JSON.stringify(response.data))
        var data = response.data
        if (data !== null) {
          var status = data.data.school.status
          if (status === true) {
            this.verified = true
            this.subtitle = 'Welcome ' + data.data.school.schoolName + '!'
            this.content = 'Your registration has been verified successfully.'
            this.$refs.successful.open()
          }
          else {
            this.$refs.failure.open()
          }
        } // c2Vjb25kMTA=
      }).catch(error => {
        console.log(JSON.stringify(error))
        this.$refs.failure.open()
      })
    }
  },
  mounted () {
    this.verifyCode()
  }
}
</script>

<style>

</style>
