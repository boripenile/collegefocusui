<template>
    <q-layout>
      <q-card>
        <q-card-title class="secondary">Manage Permissions</q-card-title>
        <q-card-main>
          <div class="flex wrap gutter">
            <div class="auto">
              <q-search placeholder="Search for permission" :debounce="500"
                        v-model.lazy="searchPermission" @input="getPermissions"/>
            </div>
            <div class="auto">
              <q-pagination
                v-model="page"
                :max="10"
              ></q-pagination>
            </div>
          </div>
          <div class="text-right">
            <q-btn color="secondary" @click="createNewRole">
              <q-icon name="add" />
              <q-tooltip>Add permission</q-tooltip>
            </q-btn>
          </div>
          <br/>
          <q-data-table
            :data="permissions"
            :config="configs"
            :columns="columns">
            <template slot="col-status" scope="cell">
              <span v-if="cell.row.status === true" class="uppercase bg-positive text-white">
                <small>Enabled</small>
              </span>
              <span v-else class="uppercase bg-negative text-white"><small>Disabled</small></span>
            </template>
            <template slot="selection" scope="selection">
              <q-btn class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Permission</q-tooltip>
              </q-btn>
              <q-btn class="negative" clear @click="deleteRole(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Permission</q-tooltip>
              </q-btn>
            </template>
          </q-data-table>
        </q-card-main>
        <q-modal ref="permissionModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected permission?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('permissionModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="permissionData" minimized noBackdropDismiss :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
          <h5>{{ roleDialogTitle }}</h5>

          <q-input stack-label="Permission" :autofocus="true" :error="$v.permission.permission.$error" 
          @blur="$v.permission.permission.$touch()" @keyup.enter="addRole"
          class="full-width text-left" v-model="permission.permission"/>

          <q-input stack-label="Description" 
          :error="$v.permission.description.$error" 
          @blur="$v.permission.description.$touch()" @keyup.enter="addRole"
          class="full-width text-left" v-model="permission.description"/>
          <br>
          <q-toggle v-model="permission.status" color="teal-8" label="Status" left-label
            unchecked-icon="visibility_off"
            checked-icon="visibility"
          />
          <br><br>
          <q-btn color="secondary" @click="addRole()">{{ acceptButtonTitle }}</q-btn>
          <q-btn color="negative" @click="closeModal('permissionData')">Discard</q-btn>
        </q-modal>
      </q-card>
      
    </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { Toast, QLayout, QCard, QCardMain, QCardTitle,
  QSearch, QPagination, QBtn, QModal, QTooltip, QDataTable,
  QInput, QIcon, QToggle } from 'quasar'
export default {
  mounted () {
    this.getPermissions()
  },
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
    QToggle
  },
  data () {
    return {
      edit: false,
      modalContent: 'Are you sure that you want to delete the permission?',
      permissions: [],
      permission: {
        permission: '',
        description: ''
      },
      errorInput: {
        message: 'Please complete the fields.'
      },
      page: 1,
      searchPermission: '',
      columns: [
        { label: 'Name', field: 'permission', width: '50px', sort: true },
        { label: 'Description', field: 'description', width: '70px', sort: true },
        { label: 'Status', field: 'status', width: '30px', sort: true }
      ],
      configs: {
        rowHeight: '50px',
        columnPicker: true,
        title: 'Permission List',
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
      },
      confirmed: false,
      roleId: 0
    }
  },
  validations: {
    permission: {
      permission: { required },
      description: { required }
    }
  },
  watch: {
    page () {
      this.getPermissions()
    }
  },
  computed: {
    roleDialogTitle () {
      if (this.edit) {
        return 'Edit Permission'
      }
      else {
        return 'New Permission'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Permission'
      }
      else {
        return 'Add Permission'
      }
    },
    url () {
      return `permissions/page?page=${this.page}&per_page=10${this.search}`
    },
    search () {
      return this.searchPermission ? `&permission_name=${this.searchPermission}` : ''
    },
    ...mapGetters(['getToken'])
  },
  methods: {
    getPermissions () {
      this.$http.college.get(this.url, {
        headers: {
          common: {'Authorization': this.getToken}
        }
      }, null)
        .then(response => { this.permissions = response.data.data })
    },
    setSelected (data) {
      console.log('Selected: ', JSON.stringify(data.rows[0].data))
      this.permission = data.rows[0].data
      this.edit = true
      this.$refs.permissionData.open()
    },
    createNewRole () {
      this.edit = false
      this.permission = {
        id: '',
        permission: '',
        description: '',
        status: true
      }
      this.$refs.permissionData.open()
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        this.$http.college.delete('permissions', {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.roleId
          }}, null).then(response => {
          this.confirmed = false
          this.getPermissions()
          this.$refs.permissionModal.close()
        })
      }
    },
    addRole () {
      if (this.$v.permission.permission.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (this.$v.permission.description.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (!this.edit) {
        if (this.acceptButtonTitle.indexOf('Add') !== -1) {
          this.$http.college.post('permissions', this.permission, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
            this.getPermissions()
            this.$refs.permissionData.close()
          })
        }
      }
      else {
        this.$http.college.put('permissions', {
          permission: this.permission.permission,
          description: this.permission.description,
          status: this.permission.status,
          superAdmin: this.permission.superAdmin
        }, {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.permission.id
          }}, null).then(response => {
          this.getPermissions()
          this.edit = false
          this.$refs.permissionData.close()
        })
      }
    },
    deleteRole (selection) {
      this.roleId = selection.rows[0].data.id
      this.$refs.permissionModal.open()
    },
    openModal (ref) {
      this.$refs[ref].open()
    },
    closeModal (ref) {
      this.$refs[ref].close()
    }
  }
}
</script>

<style scoped>
  .grid-filter{
    max-width: 200px
  }
  .grid-search{
    max-width: calc(100% - 400px)
  }
  .grid-pagination{
    max-width: 200px
  }
</style>
