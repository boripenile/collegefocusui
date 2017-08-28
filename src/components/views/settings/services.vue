<template>
      <q-layout>
      <q-card>
        <q-card-title class="secondary">Manage Services</q-card-title>
        <q-card-main>
          <div class="flex wrap gutter">
            <div class="auto">
              <q-search placeholder="Search for service" :debounce="500"
                        v-model.lazy="searchService" @input="getServices"/>
            </div>
            <div class="auto">
              <q-pagination
                v-model="page"
                :max="10"
              ></q-pagination>
            </div>
          </div>
          <div class="text-right">
            <q-btn color="secondary" @click="createNewService">
              <q-icon name="add" />
              <q-tooltip>Add Servcie</q-tooltip>
            </q-btn>
          </div>
          <br/>
          <q-data-table
            :data="services"
            :config="configs"
            :columns="columns">
            <template slot="col-academicService" scope="cell">
              <span v-if="cell.row.academicService === true" class="label uppercase">
                <small>Academic</small>
              </span>
              <span v-else class="label uppercase"><small>Non-academic</small></span>
            </template>
            <template slot="col-status" scope="cell">
              <span v-if="cell.row.status === true" class="label uppercase bg-positive text-white">
                <small>Enabled</small>
              </span>
              <span v-else class="label uppercase bg-negative text-white"><small>Disabled</small></span>
            </template>
            <template slot="col-id" scope="cell">
              <q-btn flat small @click="getSchoolsForSubscription(cell.row.id)">Subscribe
                <q-tooltip>Subscribe schools</q-tooltip>
              </q-btn>
            </template>
            <template slot="selection" scope="selection">
              <q-btn class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Service</q-tooltip>
              </q-btn>
              <q-btn class="negative" clear @click="deleteService(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Service</q-tooltip>
              </q-btn>
            </template>
          </q-data-table>
        </q-card-main>
        <q-modal ref="serviceModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected service?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('serviceModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="serviceSchoolModal" minimized noBackdropDismiss :content-css="{padding: '25px', width: '400px', textAlign: 'left'}">
          <q-list separator>
              <q-list-header><big>Schools subscribed to {{ selectedServiceName }}</big></q-list-header>
              <q-list-header class="text-negative">Manage schools subscribed to this service</q-list-header>
              <q-item v-for="(school, index) in serviceSchools" :key="index">
                <q-item-main :label="school.schoolName" />
                <q-item-side right icon="more_vert">
                  <q-popover ref="popover">
                    <q-list link>
                      <q-item @click="deleteSchool(serviceId, school.id)">
                        <q-item-main color="negative" label="Remove" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-item-side>
              </q-item>
          </q-list>
          <br>
          <q-btn color="negative" @click="closeModal('serviceSchoolModal')">Close</q-btn>
          <q-btn color="positive" @click="getSchools(loadSchools)">Add more</q-btn>
          <br>
        </q-modal>
        <q-modal ref="schoolsModal" minimized noBackdropDismiss :content-css="{padding: '25px', width: '400px', textAlign: 'left'}">
          <q-list separator>
              <q-list-header><big>Schools</big></q-list-header>
              <q-list-header class="text-negative">Please select school and subscribe to service</q-list-header>
              <q-item v-for="(school, index) in schools" :key="index">
                <q-item-main>
                  <q-checkbox v-if="school.status === true" v-model="selectedSchools" :val="school.id" :label="perm.schoolName" />
                </q-item-main> 
              </q-item>
          </q-list>
          <br>
          <q-btn color="negative" @click="closeModal('schoolsModal')">Close</q-btn>
          <q-btn color="positive" :disabled="!disableSubscribeSchools" @click="addSchools">Subscribe</q-btn>
          <br>
        </q-modal>
        <q-modal ref="serviceData" minimized noBackdropDismiss :content-css="{padding: '20px', textAlign: 'center'}">
          <h5>{{ serviceDialogTitle }}</h5>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-dialog-select class="full-width text-left"
                float-label="Service type"
                @change="onChange"
                v-model="selectedType"
                :options="types"
                ok-label="Pick"
                cancel-label="Cancel"
                title="Types of Services"
              />
            </div>
          </div>
          <div class="row sm-gutter">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-input stack-label="Service Name" 
              :error="$v.service.serviceName.$error" 
              @blur="$v.service.serviceName.$touch()" @keyup.enter="addService"
              class="full-width text-left" v-model="service.serviceName"/> 
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-input stack-label="Description" 
              :error="$v.service.serviceDescription.$error" 
              @blur="$v.service.serviceDescription.$touch()" @keyup.enter="addService"
              class="full-width text-left" v-model="service.serviceDescription"/> 
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-input type="number" stack-label="Fixed Price"
              class="full-width text-left" v-model="service.fixedPrice"/> 
            </div>
          </div>
          <br>
          <div class="row text-left">
            <div class="col-xs-12 col-sm-12 col-md-12 text-left">
              <q-toggle v-model="service.status" color="teal-8" label="Status" left-label
              unchecked-icon="visibility_off" class="align-left"
              checked-icon="visibility"
              />
            </div>
          </div>
          <br>
          <div class="row text-left">
            <div class="col-xs-12 col-sm-12 col-md-12">
              <q-checkbox v-model="hasQuantity" left-label>
                <small>Do you want price per quantity?</small>
              </q-checkbox>
            </div>
          </div>
          <div v-if="hasQuantity">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-input type="number" stack-label="Price per Quantity" 
                class="full-width text-left" v-model="service.pricePerQty"/> 
              </div>
            </div>
          </div>
          <div v-if="hasQuantity">
            <div class="row text-left">
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-checkbox v-model="trial" left-label>
                  <small>Do you want to allow trial for this service?</small>
                </q-checkbox>
              </div>
            </div>
          </div>
          <div v-if="trial">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-input type="number" stack-label="Maximum Allowed Quantity" 
                class="full-width text-left" v-model="service.fixedTrialQuantity"/> 
              </div>
            </div>
          </div>
          <div v-if="hasQuantity">
            <div class="row text-left">
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-checkbox v-model="discounted" left-label>
                  <small>Do you want to allow discount?</small>
                </q-checkbox>
              </div>
            </div>
          </div>
          <div v-if="discounted">
            <div class="row sm-gutter">
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="number" stack-label="Initial Quantity" 
                class="full-width text-left" v-model="service.firstLevelThreshold"/> 
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="number" stack-label="Initial Discount Amount" 
                class="full-width text-left" v-model="service.firstLevelDiscountAmount"/> 
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="text" stack-label="Initial Discount Percentage" 
                class="full-width text-left" v-model="service.firstLevelDiscountPercent"/> 
              </div>
            </div>
            <div class="row sm-gutter">
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="number" stack-label="Subsequent Quantity" 
                class="full-width text-left" v-model="service.otherLevelThreshold"/> 
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="number" stack-label="Subsequent Discount Amount" 
                class="full-width text-left" v-model="service.otherLevelDiscountAmount"/> 
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4">
                <q-input type="text" stack-label="Subsequent Discount Percentage" 
                class="full-width text-left" v-model="service.otherLevelDiscountPercent"/> 
              </div>
            </div>
          </div>
          
          <br><br>
            <q-btn color="secondary" @click="addService()">{{ acceptButtonTitle }}</q-btn>
            <q-btn color="negative" @click="closeModal('serviceData')">Discard</q-btn>          
          <br>
        </q-modal>
      </q-card>
      
    </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { Toast, QLayout, QCard, QCardMain, QCardTitle,
  QSearch, QPagination, QBtn, QModal, QTooltip, QDataTable,
  QInput, QIcon, QToggle, QCardSeparator, QCardActions, QList, QItem,
  QItemMain, QItemSide, QPopover, QListHeader, QCheckbox, QDialogSelect } from 'quasar'
export default {
  components: {
    Toast,
    QLayout,
    QCard,
    QCardTitle,
    QCardMain,
    QSearch,
    QPagination,
    QBtn,
    QModal,
    QTooltip,
    QDataTable,
    QInput,
    QIcon,
    QToggle,
    QCardSeparator,
    QCardActions,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QPopover,
    QListHeader,
    QCheckbox,
    QDialogSelect
  },
  computed: {
    ...mapGetters(['getToken']),
    serviceDialogTitle () {
      if (this.edit) {
        return 'Edit Service'
      }
      else {
        return 'New Service'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Service'
      }
      else {
        return 'Add Service'
      }
    },
    url () {
      return `subscriptionservices/page?page=${this.page}&per_page=10${this.search}`
    },
    search () {
      return this.searchService ? `&service_name=${this.searchService}` : ''
    },
    disableSubscribeSchools () {
      return this.selectedSchools.length > 0
    }
  },
  data () {
    return {
      edit: false,
      confirmed: false,
      page: 1,
      services: [],
      selectedType: {},
      serviceId: null,
      searchService: '',
      selectedServiceName: '',
      selectedSchools: [],
      serviceSchools: [],
      schools: [],
      service: {
        serviceName: '',
        serviceDescription: '',
        allowDiscount: false,
        trialService: false,
        status: false
      },
      types: [
        { value: false, label: 'Non-Academic' },
        { value: true, label: 'Academic' }
      ],
      hasQuantity: false,
      discounted: false,
      trial: false,
      errorInput: {
        message: 'Both service name and description are required.'
      },
      columns: [
        { label: 'Name', field: 'serviceName', width: '55px', sort: true },
        { label: 'Description', field: 'serviceDescription', width: '55px', sort: true },
        { label: 'Qty Price', field: 'pricePerQty', width: '30px', sort: true },
        { label: 'Type', field: 'academicService', width: '30px', sort: true },
        { label: 'Status', field: 'status', width: '30px' },
        { label: 'Action', field: 'id', width: '30px' }
      ],
      configs: {
        rowHeight: '50px',
        columnPicker: true,
        title: 'Service List',
        bodyStyle: {
          maxHeight: '400px'
        },
        responsive: true,
        selection: 'single',
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        noHead: true
      }
    }
  },
  validations: {
    service: {
      serviceName: { required },
      serviceDescription: { required }
    }
  },
  methods: {
    onChange () {
      this.service.academicService = this.selectedType
    },
    addSchools () {
      if (this.selectedPermissions) {
        this.$http.college.post('roles/roleperms/add', {
        }, {
          headers: {
            common: {'Authorization': this.getToken}
          }
        }, null).then(response => {
          this.selectedSchools = []
          this.reloadServiceSchools(this.roleId)
          this.$refs.schoolsModal.close()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getServices () {
      this.$http.college.get(this.url, {
        headers: {
          common: {'Authorization': this.getToken}
        }
      }, null)
        .then(response => {
          console.log('Services: ', response.data.data)
          this.services = response.data.data
        })
    },
    getSchools (callback) {
      this.$http.college.get('permissions', {
        headers: {
          common: {'Authorization': this.getToken}
        }
      }, null)
        .then(response => {
          this.permissions = response.data.data
          if (callback) {
            callback()
          }
        })
    },
    reloadServiceSchools (schoolId) {
      this.schoolId = schoolId
      this.$http.college.get('roles/permissions', {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          id: this.roleId
        }
      }, null).then(response => {
        this.serviceSchools = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    loadSchools () {
      this.$refs.schoolsModal.open()
    },
    setSelected (data) {
      this.service = data.rows[0].data
      if (this.service.allowDiscount) {
        this.hasQuantity = true
        this.discounted = true
      }
      this.selectedType = this.service.academicService
      this.trial = this.service.trialService
      this.serviceId = data.rows[0].data.id
      this.edit = true
      this.$refs.serviceData.open()
    },
    createNewService () {
      this.edit = false
      this.service = {
        serviceName: '',
        serviceDescription: '',
        allowDiscount: false,
        trialService: false,
        status: false
      }
      this.$refs.serviceData.open()
    },
    addService () {
      if (this.$v.service.serviceName.$error) {
        Toast.create.negative({html: this.errorInput.message})
        // return
      }
      if (this.$v.service.serviceDescription.$error) {
        Toast.create.negative({html: this.errorInput.message})
        // return
      }
      if (this.discounted) {
        this.service.allowDiscount = true
      }
      if (this.trial) {
        this.service.trialService = true
      }
      if (this.edit) {
        this.$http.college.put('subscriptionservices/update/' + this.serviceId,
          {
            id: this.service.id,
            serviceDescription: this.service.serviceDescription,
            fixedPrice: this.service.fixedPrice,
            pricePerQty: this.service.pricePerQty,
            allowDiscount: this.service.allowDiscount,
            academicService: this.service.academicService,
            firstLevelThreshold: this.service.firstLevelThreshold,
            firstLevelDiscountPercent: this.service.firstLevelDiscountPercent,
            firstLevelDiscountAmount: this.service.firstLevelDiscountAmount,
            otherLevelThreshold: this.service.otherLevelThreshold,
            otherLevelDiscountPercent: this.service.otherLevelDiscountPercent,
            otherLevelDiscountAmount: this.service.otherLevelDiscountAmount,
            trialService: this.service.trialService,
            fixedTrialQuantity: this.service.fixedTrialQuantity,
            serviceName: this.service.serviceName,
            status: this.service.status
          }, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
          this.$refs.serviceData.close()
          this.edit = false
          this.getServices()
        })
      }
      else {
        this.$http.college.post('subscriptionservices/create', this.service, {
          headers: {
            common: {'Authorization': this.getToken}
          }}, null).then(response => {
          this.$refs.serviceData.close()
          this.edit = false
          this.getServices()
        })
      }
    },
    deleteSchools (serviceId, schoolId) {
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        this.confirmed = false
        this.getServices()
        this.$refs.serviceModal.close()
        // this.$http.college.delete('roles', {
        //   headers: {
        //     common: {'Authorization': this.getToken}
        //   },
        //   params: {
        //     id: this.roleId
        //   }}, null).then(response => {
        // })
      }
    },
    deleteService (selection) {
      this.serviceId = selection.rows[0].data.id
      this.$refs.serviceModal.open()
    },
    getSchoolsForSubscription () {
    },
    openModal (ref) {
      this.$refs[ref].open()
    },
    closeModal (ref) {
      this.$refs[ref].close()
    }

  },
  mounted () {
    this.getServices()
  },
  watch: {
    page () {
      this.getServices()
    }
  }
}
</script>

<style>

</style>
