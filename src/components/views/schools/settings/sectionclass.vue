<template>
    <q-layout>
      <q-card>
        <div class="row">
          <div class="col-8">
            <q-card-title v-show="getSchoolSection.sectionName" class="secondary">Manage Classrooms in {{ getSchoolSection.sectionName }}</q-card-title>
          </div>
          <div class="col-4 text-right">
            <q-btn color="negative" flat @click="reOpenSchoolSectionsModal()">
                Change Section</q-btn>
          </div>
        </div>
        <q-card-main>
          <div class="text-right">
            <q-btn v-show="checkPermission('school:class:create')" color="secondary" @click="createNewSection">
            Add New Class</q-btn>
          </div>
          <br/>
          <q-data-table
            :data="schoolClasses"
            :config="configs"
            :columns="columns">
            <template slot="selection" scope="selection">
              <q-btn v-show="checkRoleAndPermission('admin', 'school:class:update')" class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Class</q-tooltip>
              </q-btn>
              <q-btn v-show="checkRoleAndPermission('admin', 'school:class:delete')" class="negative" clear @click="deleteClass(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Class</q-tooltip>
              </q-btn>
            </template>
          </q-data-table>
        </q-card-main>
        <q-modal ref="classModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected class?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('classModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="classData" minimized noBackdropDismiss :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
          <h5>{{ classDialogTitle }}</h5>

          <q-input stack-label="Name" :autofocus="true" :error="$v.schoolClass.className.$error" 
          @blur="$v.schoolClass.className.$touch()" @keyup.enter="addClass"
          class="full-width text-left" v-model="schoolClass.className"/>

          <q-input stack-label="Description" 
          :error="$v.schoolClass.description.$error" 
          @blur="$v.schoolClass.description.$touch()" @keyup.enter="addClass"
          class="full-width text-left" v-model="schoolClass.description"/>
          <br>
          <q-input stack-label="Display Order" type="number"
          class="full-width text-left" v-model="schoolClass.position"/>
          <br><br>
          <q-btn color="secondary" @click="addClass()">{{ acceptButtonTitle }}</q-btn>
          <q-btn color="negative" @click="closeModal('classData')">Discard</q-btn>
        </q-modal>
      </q-card>
      <q-modal ref="schoolSectionModal" minimized noEscDismiss noBackdropDismiss :content-css="{padding: '35px', width: '500px', textAlign: 'left'}">
          <q-list class="bg-grey-7">
              <q-list-header class="text-center text-white">
                  <h6>List of Sections</h6>
              </q-list-header>
          </q-list>
          <div class="row">
            <div class="col-12 text-center">
              <small>Select a section to continue</small>
            </div>
          </div>
          <q-list class="text-center" inset-separator>
              <q-item v-for="(section, index) in schoolSections" :key="index">
                <q-item-side left icon="accessible" />
                <q-item-main :label="section.sectionName" />
                <q-item-side right>
                  <span>
                    <q-btn round flat icon="send" color="positive" @click="setSection(section.id)">
                    </q-btn>
                  </span>
                </q-item-side>
              </q-item>
          </q-list>

          <div class="text-center" v-if="getUser.admin === true">
              <br>
              <q-btn class="col-6" flat color="orange-8" @click="openSectionList()">Add New Section</q-btn>
          </div>
      </q-modal>
    </q-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { Toast, QLayout, QCard, QCardMain, QCardTitle,
  QSearch, QPagination, QBtn, QModal, QTooltip, QDataTable,
  QInput, QIcon, QToggle, QCardSeparator, QCardActions, QList, QItem,
  QItemMain, QItemSide, QPopover, QListHeader, QCheckbox, QAlert,
  QDialogSelect } from 'quasar'
export default {
  mounted () {
    this.getSections(this.openSchoolSectionsModal)
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
    QCheckbox,
    QAlert,
    QDialogSelect
  },
  data () {
    return {
      edit: false,
      modalContent: 'Are you sure that you want to delete the classroom?',
      schoolClasses: [],
      schoolClass: {
        className: '',
        description: ''
      },
      schoolSections: [],
      errorInput: {
        message: 'Please complete the fields.'
      },
      columns: [
        { label: 'Name', field: 'className', width: '50px', sort: true },
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
      classId: null,
      selectedSectionName: '',
      selectedSectionId: '',
      selectedClassName: '',
      selectedSection: {},
      typeOfSections: []
    }
  },
  validations: {
    schoolClass: {
      className: { required },
      description: { required }
    }
  },
  computed: {
    classDialogTitle () {
      if (this.edit) {
        return 'Edit Class'
      }
      else {
        return 'New Class'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Class'
      }
      else {
        return 'Add Class'
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getSchoolSection']),
    schoolCode () {
      return this.getUser.school.schoolCode
    }
  },
  methods: {
    ...mapMutations(['setSchoolSection']),
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
    onChange () {
      console.log('Selected: ', JSON.stringify(this.selectedSection))
    },
    openSectionList () {
      this.$router.push('/schoolsections')
    },
    setSection (data) {
      for (var index = 0; index < this.schoolSections.length; index++) {
        console.log('Total: ', this.schoolSections.length)
        if (this.schoolSections[index].id === data) {
          this.setSchoolSection(this.schoolSections[index])
        }
      }
      this.$refs['schoolSectionModal'].close()
      this.getSchoolClasses()
    },
    closeModal (refModal) {
      this.$refs[refModal].close()
    },
    openModal (refModal) {
      this.$refs[refModal].open()
    },
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
          var data = response.data.data
          console.log('Sections: ', JSON.stringify(data))
          if (data.length > 0) {
            callback(data)
          } else {
            this.$router.push('/schoolsections')
          }
        })
    },
    reOpenSchoolSectionsModal () {
      console.log('All Sections: ', JSON.stringify(this.schoolSections))
      this.$refs['schoolSectionModal'].open()
    },
    openSchoolSectionsModal (data) {
      for (var index = 0; index < data.length; index++) {
        this.typeOfSections.push({
          value: data[index].id,
          label: data[index].sectionName
        })
      }
      this.schoolSections = data
      console.log('Got Sections: ', JSON.stringify(this.typeOfSections))
      this.$refs['schoolSectionModal'].open()
    },
    getSchoolClasses () {
      this.$http.college.get('classes/school', {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          sectionId: this.getSchoolSection.id
        }
      }, null)
        .then(response => {
          this.schoolClasses = response.data.data
        })
    },
    loadPermissions () {
      this.$refs.permissionsModal.open()
    },
    setSelected (data) {
      this.schoolClass = data.rows[0].data
      this.edit = true
      this.$refs.classData.open()
    },
    createNewSection () {
      this.edit = false
      this.schoolClass = {
        id: '',
        className: '',
        description: '',
        position: 0
      }
      this.$refs.classData.open()
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        console.log('Id: ', this.classId)
        this.$http.college.delete('classes', {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.classId
          }}, null).then(response => {
          this.confirmed = false
          this.getSchoolClasses()
          this.$refs.classModal.close()
        })
      }
    },
    addClass () {
      if (this.$v.schoolClass.className.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (this.$v.schoolClass.description.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (!this.edit) {
        if (this.acceptButtonTitle.indexOf('Add') !== -1) {
          this.schoolClass.sectionId = this.getSchoolSection.id
          this.$http.college.post('classes', this.schoolClass, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
            this.getSchoolClasses()
            this.$refs.classData.close()
          })
        }
      }
      else {
        this.schoolClass.sectionId = this.getSchoolSection.id
        this.$http.college.put('classes', this.schoolClass, {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.schoolClass.id
          }}, null).then(response => {
          this.getSchoolClasses()
          this.edit = false
          this.$refs.classData.close()
        })
      }
    },
    deleteClass (selection) {
      this.classId = selection.rows[0].data.id
      this.$refs.classModal.open()
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
