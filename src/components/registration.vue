<template>
  <h3>Continue your registration here... with {{ selectedType }} </h3>
</template>

<script>
export default {
  data () {
    return {
      selectedType: this.$route.params.type
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
