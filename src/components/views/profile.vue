<template>
    <div>
        <div class="row sm-gutter justify-start">
            <div class="col-xs-12 col-sm-5 col-md-5">
                <br>
                <div class="row justify-center">
                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                        <q-icon name="account_circle" style="font-size: 200px; color: #A0A0A0;" />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                        <h5>{{ getUser.username }}</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                        <q-list class="bg-teal-6">
                            <q-list-header class="text-center text-white">
                                <h6>Personal Information</h6>
                            </q-list-header>
                        </q-list>
                        <q-list no-border separator>
                            <q-item>
                                <q-item-main class="text-left" label="Email Address" />
                                <q-item-main v-if="getUser.email" class="text-left text-bold" :label="getUser.email" />
                                <q-item-main v-else class="text-left text-grey-6 text-italic" label="NOT SET" />
                            </q-item>
                            <q-item>
                                <q-item-main class="text-left" label="First Name" />
                                <q-item-main v-if="getUser.firstName" class="text-left text-bold" :label="getUser.firstName" />
                                <q-item-main v-else class="text-left text-grey-6 text-italic" label="NOT SET" />
                            </q-item>
                            <q-item>
                                <q-item-main class="text-left" label="Last Name" />
                                <q-item-main v-if="getUser.lastName" class="text-left text-bold" :label="getUser.lastName" />
                                <q-item-main v-else class="text-left text-grey-6 text-italic" label="NOT SET" />
                            </q-item>
                        </q-list>
                        <br>
                        <div class="row justify-center">
                            <q-btn flat class="col-10 text-orange">Update Profile</q-btn>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-7 col-md-7">
                <div class="col-12">
                    <br>
                    <q-tabs align="center" color="grey-7" inverted no-pane-border>
                        <!-- Tabs - notice slot="title" -->
                        <q-tab v-show="getAcademicSession" default label="Academic Session" slot="title" name="tab-1" />
                        <q-tab v-show="getAcademicSession && getUser.admin === true" label="Payments" slot="title" name="tab-2" />
                        <q-tab v-show="getAcademicSession && getUser.admin === true" slot="title" name="tab-3" icon="people" />
                        <q-tab v-show="!getAcademicSession && getUser.admin === true" slot="title" name="tab-4" icon="people" />
                        <q-tab v-show="!getAcademicSession && getUser.admin === true" slot="title" name="tab-5" label="Schools" />
                        <q-tab v-show="!getAcademicSession && getUser.admin === true" slot="title" name="tab-6" label="Payments" />
                        <!-- Targets -->
                        <q-tab-pane name="tab-1" v-if="getAcademicSession">
                            <br>
                            <div class="row justify-center">
                                <table class="q-table responsive striped-odd horizontal-separator">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Academic Session</th>
                                            <th class="text-center">Start Date</th>
                                            <th class="text-center">End Date</th>
                                            <th class="text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td data-th="Session" class="text-left">{{ getAcademicSession.sessionName }}</td>
                                            <td data-th="Start" class="text-center">{{ getAcademicSession.startDate }}</td>
                                            <td data-th="End" class="text-center">{{ getAcademicSession.endDate }}</td>
                                            <td v-if="getAcademicSession.status === true" data-th="Status" class="text-left">
                                                <small class="my-label uppercase bg-positive text-white">ACTIVATED</small>
                                            </td>
                                            <td v-else data-th="Status" class="text-left">
                                                <small class="my-label uppercase bg-negative text-white">DEACTIVATED</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </q-tab-pane>
                        <q-tab-pane name="tab-2">Tab Two</q-tab-pane>
                        <q-tab-pane name="tab-3">Tab Three</q-tab-pane>
                        <q-tab-pane name="tab-4">Tab Four</q-tab-pane>
                        <q-tab-pane name="tab-5">Tab Five</q-tab-pane>
                        <q-tab-pane name="tab-6">Tab Six</q-tab-pane>
                    </q-tabs>
                </div>
            </div>
        </div>
        <q-modal ref="subscriptionModal" minimized noBackdropDismiss noEscDismiss :content-css="{padding: '35px', width: '500px', textAlign: 'left'}">
            <div class="text-center">
                <q-list-header>
                    <big>New Academic Session Subscription</big>
                </q-list-header>
                <span>
                        <small class="text-negative">You do not have an active academic session.</small>
                    </span>
                <small class="text-negative text-bold">Please subscribe to a new academic session.</small>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12">
                    <q-dialog-select class="full-width text-left" stack-label="Academic Session" @change="onAcademicChange($event)" v-model="selectedAcademic" :display-value="selectedAcademic.label" :options="academicServices" ok-label="Pick" cancel-label="Cancel" title="Active Sessions"
                    />
                </div>
            </div>
            <div class="row" v-show="isAcademicSelected">
                <div class="col-xs-12 col-sm-12 col-md-12">
                    <q-input type="text" :autofocus="isAcademicSelected" stack-label="Prefered Academic Session Name" @keyup="checkAcademicName" :error="$v.academicInfo.academicSessionName.$error" @blur="$v.academicInfo.academicSessionName.$touch()" class="text-left text-bold"
                        v-model="academicInfo.academicSessionName" />
                </div>
            </div>
            <div v-if="isAcademicSelected && isAcademicNameValid">
                <small>Select Academic Terms</small><br>
                <small v-if="academicTerms.length > 0" class="text-grey-7">You will be able to change the default names after subscription</small>
                <br>
                <small v-if="academicTerms.length > 0" class="text-primary">{{ subscriptionTermsLabel }}</small>
                <small v-else class="text-negative">{{ subscriptionTermsLabel }}</small>
                <br>
                <div class="row">
                    <div class="col-12">
                        <q-checkbox v-model="academicTerms" @change="selectedTerms(onStartDateChanged, academicInfo.startDate)" val="First Term" label="First Term" />
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <q-checkbox v-model="academicTerms" @change="selectedTerms(onStartDateChanged, academicInfo.startDate)" val="Second Term" label="Second Term" />
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <q-checkbox v-model="academicTerms" @change="selectedTerms(onStartDateChanged, academicInfo.startDate)" val="Third Term" label="Third Term" />
                    </div>
                </div>
            </div>
            <div class="row sm-gutter text-left" v-show="isAcademicSelected && isAcademicNameValid">
                <br>
                <div class="col-xs-12 col-sm-12 col-md-12">
                    <small class="text-negative text-bold">
                            Please select an actual start date for the academic session.
                        </small>
                </div>
            </div>
            <div class="row sm-gutter" v-show="isAcademicSelected && isAcademicNameValid">
                <div class="col-xs-12 col-sm-6 col-md-6">
                    <q-datetime type="date" stack-label="Actual Start Date" :error="$v.academicInfo.startDate.$error" @blur="$v.academicInfo.startDate.$touch()" @change="onStartDateChanged($event)" v-model="academicInfo.startDate" :value="academicInfo.startDate" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                    <q-datetime disable type="date" stack-label="Expected End Date" v-model="academicInfo.endDate" :value="academicInfo.endDate" />
                </div>
            </div>
            <div class="row xs-gutter" v-if="academicTerms.length > 0 && selectedAcademic.value && isAcademicNameValid">
                <br>
                <div class="col-md-6 bg-grey-3 content-center">
                    <q-input type="number" float-label="Number of students" :error="$v.numberOfStudents.$error" @blur="$v.numberOfStudents.$touch()" class="text-left text-bold" v-model="numberOfStudents" />
                </div>
                <div class="col-md-6 text-center bg-grey-7" v-if="numberOfStudents > 0">
                    <small class="text-white">Academic amount to pay</small><br>
                    <big class="text-bold text-white">&#8358; {{ totalAmount }} </big>
                </div>
            </div>
            <br><br>
            <div class="row justify-center" v-if="academicSessions.length > 0">
                <div class="col-6">
                    <q-btn flat color="negative" @click="closeModal('subscriptionModal')">Cancel</q-btn>
                </div>
                <div class="col-6">
                    <q-btn color="positive" :disable="!proceedToPayment" @click="processSubscription(openSummaryModal)">Proceed to Payment</q-btn>
                </div>
            </div>
            <div class="row justify-center" v-else>
                <div class="col-6">
                    <q-btn color="positive" :disable="!proceedToPayment" @click="processSubscription(openSummaryModal)">Proceed to Payment</q-btn>
                </div>
            </div>
            <br>
        </q-modal>
        <q-modal ref="summaryModal" minimized noEscDismiss noBackdropDismiss :content-css="{padding: '35px', width: '500px', textAlign: 'left'}">
            <q-list class="bg-grey-6">
                <q-list-header class="text-center text-white">
                    <big>Subscription Summary</big>
                </q-list-header>
            </q-list>
            <q-list class="text-center">
                <q-item>
                    <q-item-main class="text-center text-bold" :label="subscriptionSummary.schoolName" />
                </q-item>
                <q-item>
                    <q-item-main class="text-center" label="Reference Number" />
                </q-item>
                <q-item>
                    <q-item-main class="text-center text-bold" :label="subscriptionSummary.billReference" />
                </q-item>
                <q-item class="text-center" v-if="discount === 0">
                    <q-item-main class="text-negative" label="Total amount to pay" />
                </q-item>
                <q-item class="text-center" v-else>
                    <q-item-main class="text-thin" label="Actual Total Amount" />
                </q-item>
                <div class="row justify-center" v-if="discount === 0">
                    <big>
                            <q-item-main class="text-center text-bold" :label="`&#8358; ${this.actualTotal}`" />
                        </big>
                </div>
                <q-item class="text-center" v-else>
                    <q-item-main class="crossText" :label="`&#8358; ${this.actualTotal}`" />
                </q-item>
                <q-item class="text-center" v-if="discount > 0">
                    <q-item-main class="text-negative" :label="`Total amount to pay after a discount of &#8358; ${this.discount}`" />
                </q-item>
                <div class="row justify-center" v-if="discount > 0">
                    <big>
                            <q-item-main class="text-center text-bold" :label="`&#8358; ${this.subscriptionSummary.amountDue}`" />
                        </big>
                </div>
            </q-list>
            <br>
            <div class="row justify-center">
                <q-btn class="col-6" color="positive" @click="payWithPaystack">Pay</q-btn>
            </div>
        </q-modal>
        <q-modal v-show="academicSessions.length > 0" ref="schoolAcademicSessionModal" minimized noEscDismiss noBackdropDismiss :content-css="{padding: '35px', width: '500px', textAlign: 'left'}">
            <q-list class="bg-grey-7">
                <q-list-header class="text-center text-white">
                    <h6>Academic Sessions</h6>
                </q-list-header>
            </q-list>
            <q-list class="text-center">
                <q-item v-for="(academic, index) in academicSessions" :key="index">
                    <q-alert class="col-12" color="light-green-8" icon="query_builder" enter="bounceInLeft" leave="bounceOutRight" appear :actions="[{label: 'Select to Continue', handler () { setSession(academic.sessionId) }}]">
                        <h6 class="text-white text-bold">{{ academic.sessionName }}</h6>
                    </q-alert>
                </q-item>
            </q-list>
    
            <div class="text-center" v-if="getUser.admin === true && academicServices.length > 0">
                <br>
                <q-btn class="col-6" flat color="orange-8" @click="openModal('subscriptionModal')">Add New Academic Session</q-btn>
            </div>
        </q-modal>
    </div>
</template>

<script>
import moment from 'moment'
import {
  required,
  numeric
} from 'vuelidate/lib/validators'
import {
  mapGetters,
  mapMutations
} from 'vuex'
import externalResource from '../../configs/external-resources'
import {
  QBtn,
  QModal,
  QList,
  QListHeader,
  QDialogSelect,
  QCheckbox,
  QInput,
  QDatetime,
  QItem,
  QItemMain,
  QAlert,
  QIcon,
  QTabs,
  QTab,
  QTabPane
} from 'quasar'
// import _ from 'lodash'
export default {
  mixins: [externalResource],
  data () {
    return {
      amount: 0,
      discount: 0,
      actualTotal: 0,
      email: `${this.emailAddress}`,
      schoolName: '',
      academicServices: [],
      selectedAcademic: {},
      academicTerms: ['First Term', 'Second Term', 'Third Term'],
      numberOfStudents: 10,
      showMoreLabel: 'Show More Services',
      moreServices: false,
      selectedOtherServices: [],
      isAcademicSelected: false,
      academicInfo: {
        academicSessionName: '',
        startDate: moment(),
        endDate: moment().add(12, 'months')
      },
      isAcademicNameValid: false,
      subscribe: {
        subscriptions: []
      },
      subscriptionSummary: {
        schoolName: '',
        invoiceNumber: '',
        billReference: '',
        subscriptionDate: '',
        amountDue: 0
      },
      academicSessions: [],
      termCount: 1,
      term: {
        id: 0,
        termName: '',
        termStart: '',
        termEnd: ''
      },
      termsArray: []
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getPayStackPubKey', 'getToken', 'getAcademicSession']),
    emailAddress () {
      return this.getUser.email
    },
    proceedToPayment () {
      return this.numberOfStudents > 10 && this.academicTerms.length > 0 &&
        this.academicInfo.academicSessionName
    },
    totalAmount () {
      if (this.selectedAcademic.value) {
        if (this.academicTerms.length > 0) {
          var terms = this.academicTerms.length
          var total = this.selectedAcademic.pricePerQty * this.numberOfStudents * terms
          this.actualTotal = total
          this.amount = total * 100
          return total
        }
      }
    },
    subscriptionTermsLabel () {
      if (this.academicTerms.length > 1) {
        return 'Your subscription will be for ' + this.academicTerms.length + ' academic terms.'
      }
      else if (this.academicTerms.length === 1) {
        return 'Your subscription will be for an academic term.'
      }
      else {
        return 'You have to select at least an academic term.'
      }
    }
  },
  components: {
    QBtn,
    QModal,
    QList,
    QListHeader,
    QDialogSelect,
    QCheckbox,
    QInput,
    QDatetime,
    QItem,
    QItemMain,
    QAlert,
    QIcon,
    QTabs,
    QTab,
    QTabPane
  },
  mounted () {
    if (this.getUser.school) {
      if (this.getAcademicSession === null) {
        this.getAcademicSessions()
      }
      this.getServices()
      this.setSchoolName()
    }
  },
  external: (e) => {
    e.addScript('https://js.paystack.co/v1/inline.js', {
      success () {
        console.log('PayStack plugin loaded...')
      }
    })
  },
  validations: {
    numberOfStudents: {
      required,
      numeric
    },
    academicInfo: {
      academicSessionName: {
        required
      },
      startDate: {
        required
      },
      endDate: {
        required
      }
    }
  },
  methods: {
    ...mapMutations(['setAcademicSession']),
    setSession (data) {
      for (var index = 0; index < this.academicSessions.length; index++) {
        console.log('Total: ', this.academicSessions.length)
        if (this.academicSessions[index].sessionId === data) {
          this.setAcademicSession(this.academicSessions[index])
        }
      }
      this.$refs['schoolAcademicSessionModal'].close()
    },
    setSchoolName () {
      if (this.getUser.school) {
        var school = this.getUser.school
        this.schoolName = school.schoolName
      }
    },
    processSubscription (callback) {
      this.subscribe.schoolCode = this.getUser.school.schoolCode
      this.subscribe.subscriptions.push({
        academicSession: {
          sessionName: this.academicInfo.academicSessionName,
          sessionDescription: this.academicInfo.academicSessionName,
          sessionStartDate: moment(this.academicInfo.startDate).valueOf(),
          sessionEndDate: moment(this.academicInfo.endDate).valueOf(),
          noOfSessionTerm: this.academicTerms.length,
          terms: this.academicTerms,
          sessionStatus: true
        },
        quantity: this.numberOfStudents,
        startDate: moment(this.academicInfo.startDate).valueOf(),
        expiryDate: moment(this.academicInfo.endDate).valueOf(),
        status: false,
        subscriptionServiceCode: this.selectedAcademic.value,
        subscriptionName: this.selectedAcademic.label
      })
      this.$http.college.post('subscriptionservices/subscribe', this.subscribe, {
        headers: {
          common: {
            'Authorization': this.getToken
          }
        }
      }, null).then(response => {
        var data = response.data
        this.subscriptionSummary.schoolName = data.data.schoolName
        this.subscriptionSummary.invoiceNumber = data.data.invoiceNumber
        this.subscriptionSummary.billReference = data.data.billReference
        this.subscriptionSummary.subscriptionDate = moment(data.data.subscriptionDate)
        this.subscriptionSummary.amountDue = data.data.amountDue
        this.amount = data.data.amountDue * 100

        this.discount = this.totalAmount - (this.amount / 100)
        callback()
      }).catch(error => {
        console.log(JSON.stringify(error))
      })
    },
    onStartDateChanged (data) {
      if (data && this.academicTerms.length > -1) {
        let enddate = data
        var multiplier = this.academicTerms.length * 4
        enddate = moment(enddate).add(multiplier, 'months')
        this.academicInfo.endDate = enddate
      }
    },
    checkAcademicName () {
      this.$v.academicInfo.academicSessionName.$touch()
      if (this.$v.academicInfo.academicSessionName.$error) {
        this.isAcademicNameValid = false
      }
      else {
        this.isAcademicNameValid = true
      }
    },
    closeModal (refModal) {
      this.$refs[refModal].close()
    },
    openModal (refModal) {
      this.$refs[refModal].open()
    },
    openSummaryModal () {
      this.closeModal('subscriptionModal')
      this.$refs['summaryModal'].open()
    },
    openAcademicModal () {
      if (this.academicSessions.length > 0) {
        this.openModal('schoolAcademicSessionModal')
      }
      else {
        this.openModal('subscriptionModal')
      }
    },
    selectedTerms (callback, data) {
      if (this.academicTerms.indexOf('First Term') !== -1 && this.academicTerms.indexOf('Third Term') !== -1) {
        this.resetTerms()
      }
      callback(data)
    },
    resetTerms () {
      this.academicTerms = []
      this.academicTerms.push('First Term')
      this.academicTerms.push('Second Term')
      this.academicTerms.push('Third Term')
    },
    onAcademicChange (data) {
      for (var index = 0; index < this.academicServices.length; index++) {
        if (this.academicServices[index].value === data) {
          this.selectedAcademic = this.academicServices[index]
          this.isAcademicSelected = true
        }
        else {
          this.isAcademicSelected = false
        }
      }
    },
    getServices () {
      this.$http.college.get('subscriptionservices/school', {
        params: {
          schoolCode: this.getUser.school.schoolCode
        }
      }, null)
        .then(response => {
          var data = response.data.data
          if (data) {
            this.academicServices = []
            for (var index = 0; index < data.length; index++) {
              if (data[index].status === true) {
                if (data[index].academicService === true) {
                  this.academicServices.push({
                    value: data[index].serviceCode,
                    label: data[index].serviceName,
                    pricePerQty: data[index].pricePerQty,
                    trialService: data[index].trialService
                  })
                }
              }
            }
          }
        })
    },
    getAcademicSessions () {
      this.$http.college.get('schools/academics', {
        params: {
          schoolCode: this.getUser.school.schoolCode
        }
      }, null)
        .then(response => {
          var data = response.data.data
          if (data) {
            for (var index = 0; index < data.length; index++) {
              this.academicSessions.push({
                sessionId: data[index].id,
                sessionName: data[index].sessionName,
                startDate: moment(data[index].sessionStartDate).format('MMMM Do YYYY'),
                endDate: moment(data[index].sessionEndDate).format('MMMM Do YYYY'),
                status: data[index].sessionStatus
              })
            }
            this.openAcademicModal()
          }
        })
    },
    processPayment () {
      this.$http.college.post('subscriptionservices/subscribe/pay', {
        billReference: this.subscriptionSummary.billReference,
        amountDue: this.subscriptionSummary.amountDue
      }, {
        headers: {
          common: {
            'Authorization': this.getToken
          }
        }}, null).then(response => {
        // var data = response.data
        // console.log('Data: ', JSON.stringify(data.data))
        this.$refs['summaryModal'].close()
        this.getAcademicSessions()
      }).catch(error => {
        console.log(JSON.stringify(error))
      })
    },
    payWithPaystack () {
      var self = this
      var handler = PaystackPop.setup({
        key: self.getPayStackPubKey,
        email: self.emailAddress,
        amount: self.amount,
        ref: self.subscriptionSummary.billReference, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
          custom_fields: [{
            display_name: 'School Name',
            variable_name: 'school_name',
            value: self.schoolName
          }]
        },
        callback: function (response) {
          self.processPayment()
        },
        onClose: function () {
          alert('window closed')
        }
      })
      handler.openIframe()
    }
  }
}
</script>

<style>
  .crossText {
    text-decoration: line-through
  }
</style>
