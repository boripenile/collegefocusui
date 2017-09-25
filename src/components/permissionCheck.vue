<template>
  
</template>

<script>
export default {
  params: ['role', 'permission'],
  data () {
    return {
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>

</style>
