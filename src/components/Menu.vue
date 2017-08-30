<template>
    <q-list no-border link inset-delimiter>
    <template v-for="(parent, index) in links">
      <q-collapsible v-show="showMenuContent('superadmin', 'role:create')" 
          :key="index" icon="settings" :label="replaceUnderlineToSpace(index)">
        <template v-for="child in parent.routes">
          <q-transition name="menu" :key="child">
            <q-side-link item v-show="showMenuContent(child.role, child.permission)" :to="child.route">
              <q-item-side :icon="child.materialIcon"/>
              <q-item-main :label="child.name" />
            </q-side-link>
          </q-transition>
        </template>
        </q-collapsible>
    </template>
  </q-list>
  
</template>

<script>
  import { QItemSide, QItemMain, QSideLink,
    QList, QListHeader, QCollapsible, QTransition } from 'quasar'
  export default {
    props: ['links'],
    watch: {
      '$route.path' () {
        Object.keys(this.links).forEach(parentName => { this.setParentVisibilityBasedOnRoute(this.links[parentName]) })
      }
    },
    components: {
      QSideLink,
      QItemSide,
      QItemMain,
      QList,
      QListHeader,
      QCollapsible,
      QTransition
    },
    computed: {
      currentRoutePath () {
        return this.$route.path
      }
    },
    methods: {
      setParentVisibilityBasedOnRoute (parent) {
        parent.routes.forEach(item => {
          if (this.$route.path === item.route) {
            parent.show = true
          }
        })
      },
      replaceUnderlineToSpace (text) {
        while (text.indexOf('_') !== -1) {
          text = text.replace('_', ' ')
        }
        return text
      },
      showMenuContent (role, permission) {
        console.log('checking permission, ' + role + ' ' + permission)
        if (this.$store.state.roles) {
          if (this.$store.state.roles.indexOf(role.toLowerCase()) > -1 && this.$store.state
            .permissions.indexOf(permission.toLowerCase()) > -1) {
            return true
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  .list-label:first-child{
    line-height: 50px;
  }
  .q-side-link-active {
    color: #027be3;
    background-color: #dadada !important;
    border-right: 2px solid #027be3;
  }
  .q-side-link-active .item-primary{
    color: #027be3;
  }
</style>
