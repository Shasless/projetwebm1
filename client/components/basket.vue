<template>
  <p>test</p>
</template>

<script>
module.exports = {
  name: "basket",
  async mounted() {
    try {
      await this.getUser()
    } catch (e) {
      this.login()
    }
    this.done = true
  },
  methods: {
    async getUser() {
      const res = await axios.get('/api/me')
      this.user = res.data
    },
    login() {
      window.location.hash = "#/login"
    }}
}
</script>

<style scoped>

</style>