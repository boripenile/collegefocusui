<template>
    <q-layout>
      <q-card>
        <q-card-title class="secondary">Manage Sections</q-card-title>
        <q-card-main>
          <div class="text-right">
            <q-btn v-show="checkPermission('school:class:create')" color="secondary" @click="createNewSection">
            Add New Section</q-btn>
          </div>
          <br/>
          <q-data-table
            :data="sections"
            :config="configs"
            :columns="columns">
            <template slot="selection" scope="selection">
              <q-btn v-show="checkRoleAndPermission('admin', 'school:section:update')" class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Section</q-tooltip>
              </q-btn>
              <q-btn v-show="checkRoleAndPermission('admin', 'school:section:delete')" class="negative" clear @click="deleteSection(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Section</q-tooltip>
              </q-btn>
            </template>
          </q-data-table>
        </q-card-main>
        <q-modal ref="sectionModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected section?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('sectionModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="sectionData" minimized noBackdropDismiss :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
          <h5>{{ sectionDialogTitle }}</h5>

          <q-input stack-label="Name" :autofocus="true" :error="$v.section.sectionName.$error" 
          @blur="$v.section.sectionName.$touch()" @keyup.enter="addSection"
          class="full-width text-left" v-model="section.sectionName"/>

          <q-input stack-label="Description" 
          :error="$v.section.description.$error" 
          @blur="$v.section.description.$touch()" @keyup.enter="addSection"
          class="full-width text-left" v-model="section.description"/>
          <br>
          <q-input stack-label="Display Order" type="number"
          class="full-width text-left" v-model="section.position"/>
          <br><br>
          <q-btn color="secondary" @click="addSection()">{{ acceptButtonTitle }}</q-btn>
          <q-btn color="negative" @click="closeModal('sectionData')">Discard</q-btn>
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
    this.getSections()
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
      modalContent: 'Are you sure that you want to delete the section?',
      sections: [],
      section: {
        sectionName: '',
        description: ''
      },
      errorInput: {
        message: 'Please complete the fields.'
      },
      columns: [
        { label: 'Name', field: 'sectionName', width: '50px', sort: true },
        { label: 'Description', field: 'description', width: '100px', sort: true },
        { label: 'Display Order', field: 'position', width: '30px', sort: true }
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
          rowsPerPage: 5,
          options: [5, 10, 15, 30]
        },
        noHead: true
      },
      confirmed: false,
      sectionId: null,
      selectedSectionName: ''
    }
  },
  validations: {
    section: {
      sectionName: { required },
      description: { required }
    }
  },
  computed: {
    sectionDialogTitle () {
      if (this.edit) {
        return 'Edit Section'
      }
      else {
        return 'New Section'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Section'
      }
      else {
        return 'Add Section'
      }
    },
    ...mapGetters(['getToken', 'getUser']),
    schoolCode () {
      return this.getUser.school.schoolCode
    }
  },
  methods: {
    getSections (callback) {
      this.$http.college.get('sections/school', {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          schoolCode: this.schoolCode
        }
      }, null)
        .then(response => {
          this.sections = response.data.data
          if (callback) {
            callback()
          }
        })
    },
    checkRoleAndPermission (role, permission) {
      if (this.$store.state.roles) {
        var list = this.$store.state.roles.filter(function (item) {
          return item.match(role)
        });
        if (list.length > 0 && this.$store.state.permissions.indexOf(permission.toLowerCase()) > -1) {
          return true
        }
      }
    },
    checkPermission (permission) {
      if (this.$store.state.permissions) {
        if (this.$store.state.permissions.indexOf(permission.toLowerCase()) > -1) {
          return true
        }
      }
    },
    checkSearchPermission (perm) {
      return perm.match(this.searchPermission)
    },
    loadPermissions () {
      this.$refs.permissionsModal.open()
    },
    setSelected (data) {
      this.section = data.rows[0].data
      this.edit = true
      this.$refs.sectionData.open()
    },
    createNewSection () {
      this.edit = false
      this.section = {
        id: '',
        sectionName: '',
        description: '',
        position: 0
      }
      this.$refs.sectionData.open()
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        this.$http.college.delete('sections', {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.sectionId
          }}, null).then(response => {
          this.confirmed = false
          this.getSections()
          this.$refs.sectionModal.close()
        })
      }
    },
    addSection () {
      if (this.$v.section.sectionName.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (this.$v.section.description.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (!this.edit) {
        if (this.acceptButtonTitle.indexOf('Add') !== -1) {
          this.section.schoolCode = this.schoolCode
          this.$http.college.post('sections', this.section, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
            this.getSections()
            this.$refs.sectionData.close()
          })
        }
      }
      else {
        this.$http.college.put('sections', this.section, {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.section.id
          }}, null).then(response => {
          this.getSections()
          this.edit = false
          this.$refs.sectionData.close()
        })
      }
    },
    deleteSection (selection) {
      this.sectionId = selection.rows[0].data.id
      this.$refs.sectionModal.open()
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
