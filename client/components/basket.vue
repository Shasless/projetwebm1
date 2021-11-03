<template>
  <div id="cart" v-if="done">
      <article class="cart-item" v-for="article in this.articles" :key="article.id_article">
        <div class="box">
          <div class="cart-item__details">
            <p class="is-inline">{{article.title}}</p>
            <div>
        <span class="cart-item--price has-text-info has-text-weight-bold">
          ${{article.price}} X {{article.number}}
        </span>

              <span>
          <i class="btn btn-primary" @click="addCartItem(cartItem)">up</i>
          <i class="btn btn-danger" @click="removeCartItem(cartItem)">down</i>
        </span>
            </div>

          </div>
        </div>
      </article>

      <br>
    <div class="buttons">

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#Modal">Checkout (<span >${{ this.cartTotal }}</span>)</button>

    </div>

    <div class="modal fade" id="Modal" tabindex="-1" role="dialog"  aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="order">
              <div class="form-group">
                <label for="recipient-name" class="col-form-label">Entrez votre adresse mail:</label>
                <input type="text" class="form-control" type="email" v-model="email" placeholder="Email" id="recipient-name">
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" type="submit" >Send message</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

module.exports = {
  name: "basket",

  data () {
    return {
      articles: [], // Articles à afficher
      articlesk: [], // Articles à afficher
      cartTotal : 0,
      showModal: false,
      email: "",
      done : false
    }},
  async mounted() {
    try {
      await this.getUser()
    } catch (e) {
      this.login()
    }
    this.articles = await this.getArticles()
    console.log(this.articles)

    this.done = true
  },
  methods: {
    async getArticles() {
      switch (this.order_by) {
        case 'game':
          try {
            const game = (await axios.get('/api/searchName', {params: {orderBy: 'game', searchString: this.selection_criteria}})).data[0].display_name;
            this.title = "Articles sur le jeu " + game;
          } catch (e) {}
          return (await axios.get('/api/articles', {
            params: {
              offset: this.offset,
              order_by: "game",
              game: this.selection_criteria
            }
          })).data
        case 'user':
          this.title = "Articles par " + this.selection_criteria;
          return (await axios.get('/api/articles', {
            params: {
              offset: this.offset,
              order_by: "user",
              user: this.selection_criteria
            }
          })).data
        case 'price':
          this.title = "Articles par prix croissant" ;
          return (await axios.get('/api/articles', {
            params: {
              offset: this.offset,
              order_by: "price",
            }
          })).data
        default:
          this.title = "Articles les plus récents";
          return (await axios.get('/api/articles', {params: {offset: this.offset}})).data
      }
    },
    async getUser() {
      const res = await axios.get('/api/me',)
      this.user = res.data
    },
    async order () {
      const res = await axios.delete('/api/order',{
        params: {
          mail: email,

        }})
      alert("Votre comande a ete prise en compte")
      window.location.hash = "#/"

    },
    async getBasket() {
      this.articles = await axios.get('/api/basket', {
        params: {
          id: this.user.id,
        }
      }).data
      await console.log(axios.get('/api/basket?id=8',).data)


    },
    login() {
      window.location.hash = "#/login"
    }}
}
</script>

<style scoped>

</style>