<template>
  <div class="row justify-center items-center marginal">
    <div class="col-xs-12 col-sm-10 col-md-10">
      <div class="row justify-center">
        {{ selectedType.toUpperCase() }}
      </div><br/>
      <q-stepper vertical color="teal" ref="registration" alternative-labels>
        <q-step default name="first" title="Basic Information"
        subtitle="Please complete the basic information of your school">
          <div class="row justisfy-center">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-alert
              color="orange-2"
              icon="info"
              enter="bounceInLeft"
              leave="bounceOutRight"
              appear
              dismissible
            >
              <small class="text-black">Address Line2 is optional</small>
            </q-alert>
            </div>
          </div><br>
          <div class="row text-left">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-chip class="bg-lime-1 text-black"><q-checkbox v-model="publicSchool" left-label>
                <small>Please select if your school is a public school</small>
              </q-checkbox></q-chip>
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-10 col-md-10">
              <q-field icon="home">
                <q-input stack-label="School Name"
                  @blur="$v.school.schoolName.$touch" :autofocus="true" @keyup="checkBasicData"
                  class="full-width text-left" v-model="school.schoolName" :after="[
                    {
                      icon: 'warning',
                      error: true
                    }
                  ]"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-2 col-md-2" v-if="abbreviation">
              <q-input stack-label="Abbreviation" :autofocus="abbreviation"
              class="full-width text-left" v-model="school.abbreviation"/> 
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-chip class="bg-lime-1 text-black"><q-checkbox v-model="abbreviation" left-label>
                <small>Please select to enter school abbreviation</small>
              </q-checkbox></q-chip>
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                  <q-input stack-label="Address Line 1" 
                  @blur="$v.school.address.addressLine1.$touch" @keyup="checkBasicData"
                  class="full-width text-left" v-model="school.address.addressLine1" :after="[
                    {
                      icon: 'warning',
                      error: true
                    }
                  ]"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                  <q-input stack-label="Address Line 2"
                  class="full-width text-left" v-model="school.address.addressLine2" />
              </q-field>
            </div>
          </div>
          <div class="row items-center">
            <!-- <div class="col-xs-1 col-sm-1 col-md-1">
              <img :src="selected.avatar" width="35" /> 
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-field>
                  <q-select
                    :display-value="school.selected.label"
                    @blur="$v.school.selected.$touch"
                    v-model="school.selected" @keyup="checkBasicData"
                    float-label="Country" @change="onCountrySelect($event)"
                    filter filter-placeholder="Search"
                    :options="countries" />
              </q-field>
            </div>
          </div>
          <div class="row sm-gutter items-center" v-if="school.selected.avatar">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                  <q-select
                    v-model="school.selectedState" @keyup="checkBasicData"
                    @blur="$v.school.selectedState.value.$touch"
                    float-label="State" @change="onStateSelect($event)"
                    :display-value="school.selectedState.label"
                    filter filter-placeholder="Search"
                    :options="states" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                  <q-select
                    v-model="school.selectedCity" @change="onCitySelect($event)"
                    float-label="City" @keyup="checkBasicData"
                    @blur="$v.school.selectedCity.value.$touch"
                    :display-value="school.selectedCity.label"
                    filter filter-placeholder="Search"
                    :options="cities" />
              </q-field>
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-chip class="bg-lime-1 text-black"><q-checkbox v-model="noCityFound" left-label>
                <small>Please select if your city is not in list</small>
              </q-checkbox></q-chip>
            </div>
          </div>
          <div class="row" v-if="noCityFound">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-field>
                <q-input stack-label="Please enter your city" 
                  @blur="$v.schoolCity.$touch" :autofocus="noCityFound" @keyup="checkSchoolCity"
                  class="full-width text-left" v-model="schoolCity"/>
              </q-field>
            </div>
          </div>
          <!-- Navigation for this step at the end of QStep-->
          <q-stepper-navigation class="row justify-center">
              <q-btn color="orange" :disabled="!isBasicValid" @click="$refs.registration.next()">Continue</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step icon="person" name="second" title="Contact Information" subtitle="Please provide the school primary contact">
          <div class="row justisfy-center">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-alert
              color="orange-2"
              icon="info"
              enter="bounceInLeft"
              leave="bounceOutRight"
              appear
              dismissible
            >
              <small class="text-black">Office phone number is optional</small>
            </q-alert>
            </div>
          </div><br>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-field icon="person">
                <q-input stack-label="Contact Name"
                  @blur="$v.contact.contactName.$touch" @keyup="checkContactData"
                  class="full-width text-left" v-model="contact.contactName" />
              </q-field>
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                <q-input :prefix="callingCodeLabel" stack-label="Mobile Number"
                  @blur="$v.contact.mobileNumber.$touch" @keyup="checkContactData"
                  class="full-width text-left" v-model="contact.mobileNumber" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                <q-input :prefix="callingCodeLabel" stack-label="Office Phone number"
                  @blur="$v.contact.phoneNumber.$touch" @keyup="checkContactData"
                  class="full-width text-left" v-model="contact.phoneNumber" />
              </q-field>
            </div>
          </div>
          <q-stepper-navigation class="row justify-center">
            <q-btn color="orange" :disabled="!isContactValid" @click="$refs.registration.next()">Next</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step icon="settings" name="third" title="Administrator Information" subtitle="Please provide your administrator">
          <div class="row justisfy-center">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-alert
              color="orange-2"
              icon="info"
              enter="bounceInLeft"
              leave="bounceOutRight"
              appear
              dismissible
            >
              <small class="text-black">Password length must not be less than 6 characters</small>
            </q-alert>
            </div>
          </div><br>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-field icon="person">
                <q-input stack-label="Email Address"
                  @blur="$v.admin.email.$touch" @keyup="checkAdminData"
                  class="full-width text-left" v-model="admin.email" />
              </q-field>
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-field>
                <q-input stack-label="Username"
                  @blur="$v.admin.username.$touch" @keyup="checkAdminData"
                  class="full-width text-left" v-model="admin.username" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              
              <q-field>
                <!-- <password :placeholder="passwordPlaceholder" 
                  @blur="$v.admin.password.$touch" @keyup="checkAdminData"
                  v-model="admin.password" class="input full-width text-left"
                  :secureLength="secureLength"></password> -->
                <q-input stack-label="Choose a password"
                  @blur="$v.admin.password.$touch" @keyup="checkAdminData" :min="6"
                  class="full-width text-left" type="password" v-model="admin.password" />
              </q-field>
            </div>
          </div>
          <q-stepper-navigation class="row justify-center">
            <q-btn color="orange" :disabled="!isAdminValid" @click="$refs.registration.next()">Review</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step icon="search" name="fourth" title="Review and Finalize">
          <div class="row justisfy-center">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-alert
              color="orange-2"
              icon="info"
              enter="bounceInLeft"
              leave="bounceOutRight"
              appear
              dismissible
            >
              <small class="text-black">Please review your information before you submit your request.</small>
            </q-alert>
            </div>
          </div><br>
          <q-list separator>
          <q-list-header><big>Basic Information</big></q-list-header>
          <q-item>
            <q-item-main :label="`School Name: ` + school.schoolName" />
            <q-item-main v-if="school.abbreviation" :label="`Abbreviation: ` +school.abbreviation" />
          </q-item>
          <q-item>
            <q-item-main :label="`Country: ` + school.selected.label" />
          </q-item>
          <q-item>
            <q-item-main :label="`State: ` + school.selectedState.label" />
            <q-item-main :label="`City: ` + school.selectedCity.label" />
          </q-item>
          <q-item>
            <q-item-main :label="`Address Line 1: ` + school.address.addressLine1" />
          </q-item>
          <q-item v-if="school.address.addressLine2">
            <q-item-main :label="`Address Line 2: ` + school.address.addressLine2" />
          </q-item>
          <q-list-header><big>Contact Information</big></q-list-header>
          <q-item>
            <q-item-main :label="`Contact Name: ` + contact.contactName" />
          </q-item>
           <q-item>
            <q-item-main :label="`Mobile Number: +${this.school.selected.callingCode}` + contact.mobileNumber" />
            <q-item-main :label="`Phone Number: +${this.school.selected.callingCode}` + contact.phoneNumber" />
          </q-item>
          <q-list-header><big>Administrator Information</big></q-list-header>
          <q-item>
            <q-item-main :label="`Email Address: ` + admin.email" />
          </q-item>
           <q-item>
            <q-item-main :label="`Username: ` + admin.username" />
            <q-item-main :label="`Password: *************************`" />
          </q-item>
          </q-list>
          <q-stepper-navigation class="row justify-center">
            <q-btn color="primary" @click="getGeoLatLng(submitRegistration)">Register Now</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
    <div class="col-xs-12 col-sm-10 col-md-8">
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Password from 'vue-password-strength-meter'
import jquery from 'jquery'
import { required, email, minLength, numeric } from 'vuelidate/lib/validators'
import { QStepper, QStep, QStepperNavigation, QBtn, QCheckbox,
  QInput, QField, QSelect, QChip, Loading, QAlert, QListHeader,
  QItem, QList, QItemMain } from 'quasar'
export default {
  data () {
    return {
      passwordPlaceholder: 'enter 6 characters or more.',
      secureLength: 6,
      noCityFound: false,
      isBasicValid: false,
      isContactValid: false,
      isAdminValid: false,
      publicSchool: false,
      abbreviation: false,
      schoolCity: '',
      selectedType: this.$route.params.type + ' ' + 'Registration',
      countries: [],
      states: [],
      cities: [],
      school: {
        schoolName: '',
        selected: {},
        selectedState: {},
        selectedCity: {},
        contacts: [],
        address: {
          country: '',
          city: '',
          addressLine1: '',
          longitude: 0,
          latitude: 0
        }
      },
      admin: {
        email: '',
        username: '',
        password: ''
      },
      contact: {
        contactName: '',
        mobileNumber: '',
        phoneNumber: ''
      }
    }
  },
  components: {
    QStepper,
    QStep,
    QStepperNavigation,
    QBtn,
    QCheckbox,
    QInput,
    QField,
    QSelect,
    QChip,
    QAlert,
    QListHeader,
    QItem,
    QItemMain,
    QList,
    Password
  },
  computed: {
    ...mapGetters(['getCountryApiKey', 'getGeoApiKey']),
    callingCodeLabel () {
      if (this.school.selected) {
        return '+' + this.school.selected.callingCode
      }
    }
  },
  mounted () {
    this.getCountries()
  },
  methods: {
    getGeoLatLng (registerCallback) {
      var address = null
      var city = null
      if (this.schoolCity) {
        city = this.schoolCity
      }
      else {
        city = this.school.selectedCity.label
      }
      if (this.school.selectedState) {
        address = city + ', ' + this.school.selectedState.label + ', ' + this.school.selected.label
      }
      else {
        address = city + ', ' + this.school.selected.label
      }
      this.$http.geo.get('json', {
        params: {
          'address': address,
          'key': this.getGeoApiKey
        }
      }).then(response => {
        var data = response.data.results
        console.log('Before: ', JSON.stringify(data))
        if (data.length > 0) {
          this.school.address.latitude = data[0].geometry.location.lat
          this.school.address.longitude = data[0].geometry.location.lng

          console.log(JSON.stringify(this.school))
          registerCallback()
        }
        else {
          console.log('No return')
          console.log(JSON.stringify(this.school))
          registerCallback()
        }
      }).catch(error => {
        console.log('Error occured: ' + error)
        registerCallback()
      })
    },
    submitRegistration () {
      var school = {
        address: {},
        contacts: [],
        admin: {}
      }
      school.address.country = this.school.selected.label
      school.address.state = this.school.selectedState.label
      if (this.noCityFound) {
        school.address.city = this.schoolCity
      }
      else {
        school.address.city = this.school.selectedCity.label
      }
      school.registrationType = this.selectedType
      if (this.publicSchool) {
        school.schoolType = 'government'
      }
      else {
        school.schoolType = 'private'
      }
      school.schoolName = this.school.schoolName
      if (this.school.address.addressLine2) {
        school.address.addressLine2 = this.school.address.addressLine2
      }
      if (this.school.abbreviation) {
        school.schoolShortName = this.school.abbreviation
      }
      school.address.addressLine1 = this.school.address.addressLine1
      school.address.longitude = this.school.address.longitude
      school.address.latitude = this.school.address.latitude
      school.address.addressLine1 = this.school.address.addressLine1
      school.admin = this.admin
      var mobileNumber = '+' + this.selected.callingCode + this.contact.mobileNumber
      this.contact.mobileNumber = mobileNumber
      if (this.contact.phoneNumber) {
        var phoneNumber = '+' + this.selected.callingCode + this.contact.phoneNumber
        this.contact.phoneNumber = phoneNumber
      }
      school.contacts.push(this.contact)
      console.log(JSON.stringify(school))
    },
    checkSchoolCity () {
      this.$v.schoolCity.$touch()
      if (this.$v.admin.$error) {
        this.isBasicValid = false
      }
      else {
        this.checkBasicData()
      }
    },
    checkAdminData () {
      this.$v.admin.$touch()
      if (this.$v.admin.$error) {
        this.isAdminValid = false
      }
      else {
        this.isAdminValid = true
      }
    },
    checkContactData () {
      this.$v.contact.$touch()
      if (this.$v.contact.$error) {
        this.isContactValid = false
      }
      else {
        this.isContactValid = true
      }
    },
    checkBasicData () {
      this.$v.school.$touch()
      if (this.$v.school.$error) {
        this.isBasicValid = false
      }
      else {
        this.isBasicValid = true
      }
    },
    onCountrySelect (data) {
      this.school.selectedCity = {}
      this.school.selectedState = {}
      this.getSelectedCountry(data)
    },
    onStateSelect (data) {
      this.school.selectedCity = {}
      this.getSelectedState(data)
    },
    onCitySelect (data) {
      console.log('City Select called: ', data)
      for (var j = 0; j < this.cities.length; j++) {
        if (this.cities[j].value === data) {
          console.log('Found city: ' + this.cities[j].label)
          this.school.selectedCity = this.cities[j]
        }
      }
    },
    getSelectedState (regionIndex) {
      for (var j = 0; j < this.states.length; j++) {
        if (this.states[j].value === regionIndex) {
          this.getCities(this.states[j].label)
        }
      }
    },
    getCities (region) {
      var self = this
      Loading.show()
      var url = 'https://battuta.medunes.net/api/city/' + self.school.selected.value + '/search/?region=' +
      region + '&key=' + this.getCountryApiKey + '&callback=?'
      jquery.getJSON(url)
        .done(function (cities) {
          self.cities = []
          for (var j = 0; j < cities.length; j++) {
            self.cities.push({
              value: j + 1,
              label: cities[j].city
            })
          }
        })
        .always(function () {
          for (var index = 0; index < self.states.length; index++) {
            if (self.states[index].label === region) {
              self.school.selectedState = self.states[index]
            }
          }
          this.checkBasicData()
          Loading.hide()
        })
    },
    getSelectedCountry (code) {
      this.getStates(code)
    },
    getStates (countryCode) {
      var self = this
      Loading.show()
      var url = 'https://battuta.medunes.net/api/region/' + countryCode + '/all/?key=' +
      this.getCountryApiKey + '&callback=?'
      jquery.getJSON(url)
        .done(function (regions) {
          self.states = []
          for (var j = 0; j < regions.length; j++) {
            self.states.push({
              value: j + 1,
              label: regions[j].region
            })
          }
        })
        .always(function () {
          for (var index = 0; index < self.countries.length; index++) {
            if (self.countries[index].value === countryCode) {
              self.school.selected = self.countries[index]
            }
          }
          this.checkBasicData()
          Loading.hide()
        })
    },
    registerSchool () {
    },
    getCountries () {
      this.$http.country.get('all', null)
        .then(response => {
          if (response.data) {
            var data = response.data
            for (var index = 0; index < data.length; index++) {
              this.countries.push({
                value: data[index].alpha2Code,
                label: data[index].name,
                avatar: data[index].flag,
                callingCode: data[index].callingCodes[0]
              })
            }
          }
        })
    }
  },
  validations: {
    schoolCity: {
      required
    },
    school: {
      schoolName: { required },
      address: {
        addressLine1: {
          required
        }
      },
      selected: {
        value: {
          required
        }
      },
      selectedState: {
        value: {
          required
        }
      },
      selectedCity: {
        value: {
          required
        }
      }
    },
    contact: {
      contactName: {
        required
      },
      mobileNumber: {
        required,
        numeric
      },
      phoneNumber: {
        numeric
      }
    },
    admin: {
      email: {
        required,
        email
      },
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  }
}
</script>

<style>
  .marginal {
    margin-top: 2%;
  }
  html {
    background-color: #FAFAFA;
  }
</style>
