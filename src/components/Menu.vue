<template>
    <q-list no-border link inset-delimiter>
      <q-side-link item to="/dashboard">
        <q-item-side icon="domain"/>
        <q-item-main label="Dashboard" />
      </q-side-link>
    <template v-for="(parent, index) in links">
      <q-collapsible :key="index" :icon="parent.icon" 
        v-show="showMenuContent(parent.role, parent.permission)" 
        :label="index">
        <template v-for="child in parent.routes">
          <q-transition name="menu" :key="child">
            <div v-if="child.children.length > 0">
              <q-collapsible :icon="child.materialIcon" 
                v-show="showMenuContent(child.role, child.permission)" 
                :label="child.name">
                <template v-for="inner in child.children">
                  <q-side-link :key="inner"  item v-show="showMenuContent(inner.role, inner.permission)" :to="inner.route">
                    <q-item-side :icon="inner.materialIcon"/>
                    <q-item-main :label="inner.name" />
                  </q-side-link>
                </template>
              </q-collapsible>
            </div>
            <div v-else>
              <q-side-link  item v-show="showMenuContent(child.role, child.permission)" :to="child.route">
                <q-item-side :icon="child.materialIcon"/>
                <q-item-main :label="child.name" />
              </q-side-link>
            </div>
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
