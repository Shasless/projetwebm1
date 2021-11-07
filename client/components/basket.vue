<template>
  <div>
  <div class="centered" style="max-width: 80%">
    <h2> PANIER</h2>
  </div>
  <div id="cart" v-if="done">


      <article v-for="article in articles" :key="article.id" class="card" >
<div v-on:click="navigateArticle(article.id)">
        <img class="img-square-wrapper" :src="article.cover" alt="cover image"  v-if=article.cover>
        <span class="card-img-top" v-else></span>
        <div class="card-body">
          <h2 class="card-title">{{article.title}} </h2>
          <h4 class="text-muted">{{article.price}}€ - Quantity {{article.number}}  Total: {{article.number*article.price}}</h4>
         </div>
        </div>
        <button class="btn btn-success" @click="addOne(article.id)"> + </button>
        <button class="btn btn-success" @click="delOne(article.id)"> - </button>
        <button class="btn btn-danger" @click="del(article.id)"> Supprimer </button>

      </article>



      <br>

      <button  class="btn btn-primary" @click="order" >Commander (<span >{{ this.cartTotal }}€</span>)</button>


  </div></div>
</template>

<script>

module.exports = {
  name: "basket",

  data () {
    return {
      articles: [], // Articles à afficher
      cartTotal : 0,
      showModal: false,
      email: "",
      done : false,
    }},
  async mounted() {
    try {
      await this.getUser()
    } catch (e) {
      this.login()
    }
    this.articles = await this.getBasket()

    this.cartTotal = await this.total();
    this.done = true
  },
  methods: {
    navigateArticle (id) {
      window.location.hash = "#/article/"+id.toString()
    },
    async getUser() {
      const res = await axios.get('/api/me',)
      this.user = res.data
    },
    async order () {
      const res = await axios.delete('/api/order',)
      alert("Votre comande a ete prise en compte")
      window.location.hash = "#/"

    },
    async getBasket() {
      return (await axios.get('/api/basket')).data

    },   async delOne(id) {

      this.$emit('addtobasket', this.user.id, id, -1)

      this.$router.go()


    },   async addOne(id) {
      this.$emit('addtobasket', this.user.id, id, 1)
      this.$router.go()



    },
    async del(id) {
      this.$router.go()
      (await axios.delete('/api/delltobasket', {params: {id_article: id}})).data


    },
    async total(){
      let a = 0;
      for(let i = 0;i<this.articles.length;i++){
        a+=this.articles[i].number *this.articles[i].price
      }
      return a
    },
    login() {
      window.location.hash = "#/login"
    }}
}
</script>

<style scoped>


.card {
  margin-left: 3%;
  flex-direction: row;
  align-items: center;
  max-width: 75%;
}
.card-title {
  font-weight: bold;
}
.card img {

  border-top-right-radius: 0;
  border-bottom-left-radius: calc(0.25rem - 1px);
  max-height: 12em;
  min-height: 6em;
}
.centered {
  margin: 0 auto;
  text-align: center;
}

</style>