<template>
  <div class="row justify-center items-center marginal">
    <div class="col-xs-12 col-sm-10 col-md-10">
      <q-stepper vertical color="teal" ref="registration" alternative-labels>
        <q-step default name="first" title="Basic Information" error-icon="warning"
        subtitle="Please complete the basic information of your school">
          <div class="row justisfy-center">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-alert
              color="orange-1"
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
              <q-chip class="bg-lime-2 text-black"><q-checkbox v-model="publicSchool" left-label>
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
              <q-chip class="bg-lime-2 text-black"><q-checkbox v-model="abbreviation" left-label>
                <small>Please select to enter school abbreviation</small>
              </q-checkbox></q-chip>
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
          <!-- Navigation for this step at the end of QStep-->
          <q-stepper-navigation class="row justify-center">
              <q-btn color="orange" :disabled="!isBasicValid" @click="$refs.registration.next()">Continue</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step error name="second" title="Custom channels" subtitle="Alert message">
          <div v-for="n in 10" :key="n">Step 2</div>
          <q-stepper-navigation class="row justify-center">
            <q-btn color="secondary" :disabled="!isBasicValid" @click="$refs.registration.next()">Next</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="third" title="Get code">
          <div v-for="n in 3" :key="n">Step 3</div>
          <q-stepper-navigation>
            <q-btn color="secondary" @click="$refs.registration.next()">Next</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fifth" disable title="Disabled">
          <div v-for="n in 3" :key="n">Step 4</div>
          <q-stepper-navigation>
            <q-btn color="secondary" @click="$refs.registration.next()">Next</q-btn>
            <q-btn color="secondary" flat @click="$refs.registration.previous()">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fourth" title="Review and Finalize">
          <div v-for="n in 3" :key="n">Step 5</div>
          <q-stepper-navigation>
            <q-btn color="secondary" @click="$refs.registration.goToStep('first')">Restart</q-btn>
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
import jquery from 'jquery'
import { required, email, minLength } from 'vuelidate/lib/validators'
import { QStepper, QStep, QStepperNavigation, QBtn, QCheckbox,
  QInput, QField, QSelect, QChip, Loading, QAlert } from 'quasar'
export default {
  data () {
    return {
      isBasicValid: false,
      isContactValid: false,
      publicSchool: false,
      abbreviation: false,
      selectedType: this.$route.params.type,
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
          addressLine1: ''
        }
      },
      admin: {
        email: '',
        username: '',
        password: ''
      },
      contact: {
        contactName: '',
        mobileNumber: ''
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
    QAlert
  },
  computed: {
    ...mapGetters(['getCountryApiKey'])
  },
  mounted () {
    this.getCountries()
  },
  methods: {
    checkBasicData () {
      this.$v.school.$touch()
      console.log('About to validate')
      if (this.$v.school.$error) {
        this.isBasicValid = false
        console.log('Validating...: ', this.isBasicValid)
      }
      else {
        this.isBasicValid = true
        console.log('Validated...: ', this.isBasicValid)
      }
    },
    onCountrySelect (data) {
      this.getSelectedCountry(data, this.getStates(data))
    },
    onStateSelect (data) {
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
          Loading.hide()
        })
    },
    getSelectedCountry (code, stateCallback) {
      stateCallback(code)
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
                avatar: data[index].flag
              })
            }
          }
        })
    }
  },
  validations: {
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
        minLength: minLength(4)
      }
    }
  }
}
</script>

<style>
  .marginal {
    margin-top: 5%;
  }
</style>
