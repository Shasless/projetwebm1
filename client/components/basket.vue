<template>
  <p>test

    <button type="button" class="btn btn-primary"  v-on:click="order()" >Commander</button>
  </p>
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
      const res = await axios.get('/api/me',)
      this.user = res.data
    },
    async order() {
      const res = await axios.delete('/api/order',)
      alert("Votre comande a ete prise en compte")
      window.location.hash = "#/"

    },
    async getBasket() {
      return (await axios.get('/api/basket', {
        params: {
          id: this.user.id,
        }
      })).data
    },
    login() {
      window.location.hash = "#/login"
    }}
}
</script>

<style scoped>

</style>