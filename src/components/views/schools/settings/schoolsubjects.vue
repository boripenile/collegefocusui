<template>
    <q-layout>
      <q-card>
        <q-card-title class="secondary">Manage School Subjects</q-card-title>
        <q-card-main>
          <div class="flex wrap gutter">
            <div class="auto">
              <q-search placeholder="Search for subjects" :debounce="500"
                        v-model.lazy="searchSubject" @input="getSubjects"/>
            </div>
            <div class="auto">
              <q-pagination
                v-model="page"
                :max="10"
              ></q-pagination>
            </div>
          </div>
          <div class="text-right">
            <q-btn v-show="checkPermission('school:subject:create')" color="secondary" @click="createNewSubject">
            Add New Subject</q-btn>
          </div>
          <br/>
          <q-data-table
            :data="subjects"
            :config="configs"
            :columns="columns">
            <template slot="col-status" scope="cell">
              <span v-if="cell.row.status === true" class="my-label uppercase bg-positive text-white">
                <small>Enabled</small>
              </span>
              <span v-else class="my-label uppercase bg-negative text-white"><small>Disabled</small></span>
            </template>
            <template slot="selection" scope="selection">
              <q-btn v-show="checkRoleAndPermission('admin', 'school:subject:update')" class="primary" clear @click="setSelected(selection)">
                <q-icon name="edit" />
                <q-tooltip>Edit Subject</q-tooltip>
              </q-btn>
              <q-btn v-show="checkRoleAndPermission('admin', 'school:subject:delete')" class="negative" clear @click="deleteSection(selection)">
                <q-icon name="delete" />
                <q-tooltip>Remove Subject</q-tooltip>
              </q-btn>
            </template>
          </q-data-table>
        </q-card-main>
        <q-modal ref="subjectModal" minimized noBackdropDismiss :content-css="{padding: '20px', width: '350px', textAlign: 'center'}">
          <p class="thin text-center">Are you sure that you want delete the selected subject?</p>
          <br/>
          <q-btn color="secondary" @click="confirmDeletion()">Delete</q-btn>
          <q-btn color="negative" @click="closeModal('subjectModal')">Discard</q-btn>
        </q-modal>
        <q-modal ref="subjectData" minimized noBackdropDismiss :content-css="{padding: '20px', width: '400px', textAlign: 'center'}">
          <h5>{{ subjectDialogTitle }}</h5>

          <q-input stack-label="Name" :autofocus="true" :error="$v.subject.subjectName.$error" 
          @blur="$v.subject.subjectName.$touch()" @keyup.enter="addSubject"
          class="full-width text-left" v-model="subject.subjectName"/>

          <q-input stack-label="Abbreviation" 
          :error="$v.subject.abbreviation.$error" 
          @blur="$v.subject.abbreviation.$touch()" @keyup.enter="addSubject"
          class="full-width text-left" v-model="subject.abbreviation"/>
          <br>
          <q-toggle v-model="subject.status" color="teal-8" label="Status" left-label
          unchecked-icon="visibility_off" class="align-left"
          checked-icon="visibility"
          />
          <q-input stack-label="Display Order" type="number"
          class="full-width text-left" v-model="subject.position"/>
          <br><br>
          <q-btn color="secondary" @click="addSubject()">{{ acceptButtonTitle }}</q-btn>
          <q-btn color="negative" @click="closeModal('subjectData')">Discard</q-btn>
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
    this.getSubjects()
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
      modalContent: 'Are you sure that you want to delete the subject?',
      subjects: [],
      subject: {
        subjectName: '',
        abbreviation: '',
        status: true,
        position: 0
      },
      errorInput: {
        message: 'Please complete the fields.'
      },
      columns: [
        { label: 'Name', field: 'subjectName', width: '100px', sort: true },
        { label: 'Abbreviation', field: 'abbreviation', width: '50px', sort: true },
        { label: 'Status', field: 'status', width: '40px' },
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
      page: 1,
      searchSubject: '',
      confirmed: false,
      subjectId: null,
      selectedSectionName: ''
    }
  },
  validations: {
    subject: {
      subjectName: { required },
      abbreviation: { required }
    }
  },
  watch: {
    page () {
      this.getSubjects()
    }
  },
  computed: {
    subjectDialogTitle () {
      if (this.edit) {
        return 'Edit Subject'
      }
      else {
        return 'New Subject'
      }
    },
    acceptButtonTitle () {
      if (this.edit) {
        return 'Update Subject'
      }
      else {
        return 'Add Subject'
      }
    },
    url () {
      return `subjects/page?page=${this.page}&per_page=10${this.search}`
    },
    search () {
      return this.searchSubject ? `&subject_name=${this.searchSubject}` : ''
    },
    ...mapGetters(['getToken', 'getUser']),
    schoolCode () {
      return this.getUser.school.schoolCode
    }
  },
  methods: {
    getSubjects (callback) {
      this.$http.college.get(this.url, {
        headers: {
          common: {'Authorization': this.getToken}
        },
        params: {
          schoolCode: this.schoolCode
        }
      }, null)
        .then(response => {
          this.subjects = response.data.data
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
    setSelected (data) {
      this.subject = data.rows[0].data
      this.edit = true
      this.$refs.subjectData.open()
    },
    createNewSubject () {
      this.edit = false
      this.subject = {
        id: '',
        subjectName: '',
        abbreviation: '',
        status: true,
        position: 0
      }
      this.$refs.subjectData.open()
    },
    confirmDeletion () {
      this.confirmed = true
      if (this.confirmed) {
        this.$http.college.delete('subjects', {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.subjectId
          }}, null).then(response => {
          this.confirmed = false
          this.getSubjects()
          this.$refs.subjectModal.close()
        })
      }
    },
    addSubject () {
      if (this.$v.subject.subjectName.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (this.$v.subject.abbreviation.$error) {
        Toast.create.negative({html: this.errorInput.message})
        return
      }
      if (!this.edit) {
        if (this.acceptButtonTitle.indexOf('Add') !== -1) {
          this.subject.schoolCode = this.schoolCode
          this.$http.college.post('subjects', this.subject, {
            headers: {
              common: {'Authorization': this.getToken}
            }}, null).then(response => {
            this.getSubjects()
            this.$refs.subjectData.close()
          })
        }
      }
      else {
        this.subject.schoolCode = this.schoolCode
        this.$http.college.put('subjects', this.subject, {
          headers: {
            common: {'Authorization': this.getToken}
          },
          params: {
            id: this.subject.id
          }}, null).then(response => {
          this.getSubjects()
          this.edit = false
          this.$refs.subjectData.close()
        })
      }
    },
    deleteSection (selection) {
      this.subjectId = selection.rows[0].data.id
      this.$refs.subjectModal.open()
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
