<template>
    <q-layout>
      <q-card>
        <q-card-title class="secondary">Manage Roles</q-card-title>
        <q-card-main>
          <div class="flex wrap gutter">
            <div class="auto">
              <q-search placeholder="Search for role name" :debounce="500"
                        v-model.lazy="searchRole" @input="getRoles"/>
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
            Add New Role</q-btn>
          </div>
          <br/>
          <q-data-table
            :data="roles"
            :config="configs"
            :columns="columns">
            <template slot="col-status" scope="cell">
              <span v-if="cell.row.status === true" class="my-label uppercase bg-positive text-white">
                <small>Enabled</small>
              </span>
              <span v-else class="my-label uppercase bg-negative text-white"><small>Disabled</small></span>
            </template>
            <template slot="col-id" scope="cell">
              <q-btn flat small @click="getRolePermissions(cell.row.id, cell.row.description)">Permissions
                <q-tooltip>Manage permissions</q-tooltip>
              </q-btn>
            </template>
            <template slot="selection" scope="selection">
              <q-btn class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Role</q-tooltip>
              </q-btn>
              <q-btn class="negative" clear @click="deleteRole(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Role</q-tooltip>
              </q-btn>
            </template>

          </q-data-table>
        </q-card-main>
        <q-modal ref="roleModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected role?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('roleModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="rolePermissionModal" minimized noBackdropDismiss :content-css="{padding: '25px', width: '400px', textAlign: 'left'}">
          <q-list separator>
              <q-list-header><big>{{ selectedRoleName }} Permissions</big></q-list-header>
              <q-list-header class="text-negative">Manage permissions of this role</q-list-header>
              <q-search v-model="searchRolePermission" @change="filterRolePermissions()" />
              <div v-if="filteredRolePermissions.length > 0">
                <q-item v-for="(perm, index) in filteredRolePermissions" :key="index">
                  <q-item-main :label="perm.description" />
                  <q-item-side right icon="more_vert">
                    <q-popover ref="popover">
                      <q-list link>
                        <q-item @click="deletePermissions(roleId, perm.id)">
                          <q-item-main color="negative" label="Remove" />
                        </q-item>
                      </q-list>
                    </q-popover>
                  </q-item-side>
                </q-item>
              </div>
              <div v-else>
                <q-item v-for="(perm, index) in rolePermissions" :key="index">
                  <q-item-main :label="perm.description" />
                  <q-item-side right icon="more_vert">
                    <q-popover ref="popover">
                      <q-list link>
                        <q-item @click="deletePermissions(roleId, perm.id)">
                          <q-item-main color="negative" label="Remove" />
                        </q-item>
                      </q-list>
                    </q-popover>
                  </q-item-side>
                </q-item>
              </div>
          </q-list>
          <br>
          <q-btn color="negative" @click="closeModal('rolePermissionModal')">Close</q-btn>
          <q-btn color="positive" @click="getPermissions(loadPermissions)">Add more</q-btn>
          <br>
        </q-modal>
        <q-modal ref="permissionsModal" minimized noBackdropDismiss :content-css="{padding: '25px', width: '400px', textAlign: 'left'}">
          <q-list separator>
              <q-list-header><big>Permissions</big></q-list-header>
              <q-list-header class="text-negative">Please select permissions and assign to role</q-list-header>
              <q-search v-model="searchPermission" @change="filterPermissions()" />
              <div v-if="filteredPermissions.length > 0">
                <q-item v-for="(perm, index) in filteredPermissions" :key="index">
                  <q-item-main>
                    <q-checkbox v-if="perm.status === true" v-model="selectedPermissions" :val="perm.id" :label="perm.description" />
                  </q-item-main> 
                </q-item>
              </div>
              <div v-else>
                <q-item v-for="(perm, index) in permissions" :key="index">
                  <q-item-main>
                    <q-checkbox v-if="perm.status === true" v-model="selectedPermissions" :val="perm.id" :label="perm.description" />
                  </q-item-main> 
                </q-item>
              </div>
          </q-list>
          <br>
          <q-btn color="negative" @click="closeModal('permissionsModal')">Close</q-btn>
          <q-btn color="positive" :disabled="!disableAssignPermissions" @click="addPermissions">Assign</q-btn>
          <br>
        </q-modal>
        <q-modal ref="roleData" minimized noBackdropDismiss :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
          <h5>{{ roleDialogTitle }}</h5>

          <q-input stack-label="Role" :autofocus="true" :error="$v.role.roleName.$error" 
          @blur="$v.role.roleName.$touch()" @keyup.enter="addRole"
          class="full-width text-left" v-model="role.roleName"/>

          <q-input stack-label="Description" 
          :error="$v.role.description.$error" 
          @blur="$v.role.description.$touch()" @keyup.enter="addRole"
          class="full-width text-left" v-model="role.description"/>
          <br>
          <q-toggle v-model="role.status" color="teal-8" label="Status" left-label
          unchecked-icon="visibility_off" class="align-left"
          checked-icon="visibility"
          />
          <br><br>

          <q-btn color="secondary" @click="addRole()">{{ acceptButtonTitle }}</q-btn>
          <q-btn color="negative" @click="closeModal('roleData')">Discard</q-btn>
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
  QItemMain, QItemSide, QPopover, QListHeader, QCheckbox } from 'quasar'
export default {
  mounted () {
    this.getRoles()
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
    QToggle,
    QCardSeparator,
    QCardActions,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QPopover,
    QListHeader,
    QCheckbox
  },
  data () {
    return {
      edit: false,
      searchPermission: '',
      searchRolePermission: '',
      modalContent: 'Are you sure that you want to delete the role?',
      roles: [],
      role: {
        roleName: '',
        description: ''
      },
      errorInput: {
        message: 'Please complete the fields.'
      },
      page: 1,
      searchRole: '',
      columns: [
        { label: 'Name', field: 'roleName', width: '50px', sort: true },
        { label: 'Description', field: 'description', width: '70px', sort: true },
        { label: 'Status', field: 'status', width: '30px', sort: true },
        { label: 'Action', field: 'id', width: '40px', sort: true }
      ],
      permColumns: [
        { label: 'Name', field: 'description', width: '100px', sort: true, filter: true },
        { label: 'Status', field: 'status', width: '30px', sort: true }
      ],
      configs: {
        rowHeight: '50px',
        columnPicker: true,
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
      permConfigs: {
        rowHeight: '50px',
        responsive: true,
        title: 'Permissions List',
        bodyStyle: {
          maxHeight: '400px'
        },
        selection: 'single',
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        noHead: true
      },
      confirmed: false,
      roleId: null,
      selectedRoleName: '',
      selectedPermissions: [],
      rolePermissions: [],
      permissions: [],
      filteredPermissions: [],
      filteredRolePermissions: []
    }
  },
  validations: {
    role: {
      roleName: { required },
      description: { required }
    }
  },
  watch: {
    page () {
      this.getRoles()
    }
  },
  computed: {
    roleDialogTitle () {
      if (this.edit) {
        return 'Edit Role'
      }
      else {
        return 'New Role'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Role'
      }
      else {
        return 'Add Role'
      }
    },
    disableAssignPermissions () {
      return this.selectedPermissions.length > 0
    },
    url () {
      return `roles/page?page=${this.page}&per_page=10${this.search}`
    },
    search () {
      return this.searchRole ? `&role_name=${this.searchRole}` : ''
    },
    ...mapGetters(['getToken'])
  },
  methods: {
    filterRolePermissions () {
      if (this.searchRolePermission.length > 2) {
        this.filteredRolePermissions = []
        this.filteredRolePermissions = this.rolePermissions.filter(this.checkSearchRolePermission)
      }
      else {
        this.filteredRolePermissions = []
        this.getPermissions()
      }
    },
    checkSearchRolePermission (perm) {
      return perm.description.match(this.searchRolePermission)
    },
    filterPermissions () {
      console.log('Search for: ', this.searchPermission)
      if (this.searchPermission.length > 2) {
        this.filteredPermissions = []
        this.filteredPermissions = this.permissions.filter(this.checkSearchPermission)
      }
      else {
        this.filteredPermissions = []
        this.getPermissions()
      }
    },
    checkSearchPermission (perm) {
      return perm.description.match(this.searchPermission)
    },
    addPermissions () {
      if (this.selectedPermissions) {
        this.$http.college.post('roles/roleperms/add', {
          roleIds: [this.roleId],
          permissionIds: this.selectedPermissions
        }, {
          headers: {
            common: {'Authorization': this.getToken}
          }
        }, null).then(response => {
          this.selectedPermissions = []
          this.reloadRolePermissions(this.roleId)
          this.$refs.permissionsModal.close()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getRoles () {
      this.$http.college.get(this.url, {
        headers: {
          common: {'Authorization': this.getToken}
        }
      }, null)
        .then(response => { this.roles = response.data.data })
    },
    getPermissions (callback) {
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
    loadPermissions () {
      this.$refs.permissionsModal.open()
    },
    setSelected (data) {
      this.role = data.rows[0].data
      this.edit = true
      this.$refs.roleData.open()
    },
    createNewRole () {
      this.edit = false
      this.role = {
        id: '',
        roleName: '',
        description: '',
        status: true
      }
      this.$refs.roleData.open()
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        this.$http.college.delete('roles', {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.roleId
          }}, null).then(response => {
          this.confirmed = false
          this.getRoles()
          this.$refs.roleModal.close()
        })
      }
    },
    deletePermissions (roleId, permId) {
      this.$http.college.post('roles/roleperms/remove', {
        roleIds: [roleId],
        permissionIds: [permId]
      }, {
        headers: {
          common: {'Authorization': this.getToken}
        }
      }, null).then(response => {
        this.reloadRolePermissions(roleId)
      }).catch(error => {
        console.log(error)
      })
    },
    reloadRolePermissions (roleId) {
      this.roleId = roleId
      this.$http.college.get('roles/permissions', {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          id: this.roleId
        }
      }, null).then(response => {
        this.rolePermissions = response.data.data
        this.filterRolePermissions()
      }).catch(error => {
        console.log(error)
      })
    },
    getRolePermissions (roleId, roleName) {
      this.roleId = roleId
      this.selectedRoleName = roleName
      this.$http.college.get('roles/permissions', {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          id: this.roleId
        }
      }, null).then(response => {
        this.rolePermissions = response.data.data
        this.$refs.rolePermissionModal.open()
      }).catch(error => {
        console.log(error)
        this.$refs.rolePermissionModal.open()
      })
    },
    addRole () {
      if (this.$v.role.roleName.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (this.$v.role.description.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (!this.edit) {
        if (this.acceptButtonTitle.indexOf('Add') !== -1) {
          this.$http.college.post('roles', this.role, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
            this.getRoles()
            this.$refs.roleData.close()
          })
        }
      }
      else {
        this.$http.college.put('roles', this.role, {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.role.id
          }}, null).then(response => {
          this.getRoles()
          this.edit = false
          this.$refs.roleData.close()
        })
      }
    },
    deleteRole (selection) {
      this.roleId = selection.rows[0].data.id
      this.$refs.roleModal.open()
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
