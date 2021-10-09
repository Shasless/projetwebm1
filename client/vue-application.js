const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Homepage = window.httpVueLoader('./components/Homepage.vue')
const CreateArticle = window.httpVueLoader('./components/CreateArticle.vue')
const article = window.httpVueLoader('./components/article.vue')
const user = window.httpVueLoader('./components/user.vue')
const basket = window.httpVueLoader('./components/basket.vue')

const routes = [
  { path: '/', component: Homepage },
  { path: '/create', component: CreateArticle },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/user/:username', component: user,name: 'user' },
  {path: '/article/:id', component: article, name: 'article'},
  {path: '/basket', component: basket}
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    user: {
      id: null,
      email: null,
      username: null,
    },
    done: false
  },
  async mounted () {
    try {
      await this.getUser()
    } catch (e) {}
    this.done = true
  },
  methods: {
    async registerUser (email, password, username) {
      try{
        await axios.post('/api/register', {email: email, password: password, username: username})
        alert("Vous êtes désormais enregistré !")
        window.location.hash = "#/" //On renvoie l'utilisateur sur la page d'accueil
      } catch (e) { //Gestion des erreurs de l'API
        if (e.response.status === 400) {
          if (e.response.data.message.includes("request must include email and password")) {
            alert("Merci de compléter tous les champs.")
          } else if (e.response.data.message.includes("bad request - user already exists")) {
            alert("Cet utilisateur existe déjà.")
          } else if (e.response.data.message.includes("bad request - username must be shorter than 30 characters")) {
            alert("Veuillez utiliser un nom d'utilisateur de moins de 30 caractères.") //Ne devrait pas se déclencher car vérifié auparavant part le component
          }
        } else if (e.response.status === 500) {
          alert("Une erreur s'est produite sur le serveur, merci de réessayer.")
        } else {
          alert("Une erreur est survenue.")
        }
      }
    },
    async logUser (email, password) {
      try {
        await axios.post('/api/login', {email: email, password: password})
        await this.getUser();
        alert("Vous êtes désormais connecté !")
        window.location.hash = "#/" //On renvoie l'utilisateur sur la page d'accueil
      } catch (e) { //Gestion des erreurs de l'API
        if (e.response.status === 400) {
          if (e.response.data.message.includes("request must include email and password")) {
            alert("Merci de compléter tous les champs.")
          } else if (e.response.data.message.includes("bad request - invalid password")) {
            alert("Mot de passe incorrect.")
          } else if (e.response.data.message.includes("bad request - invalid user")) {
            alert("Aucun utilisateur trouvé.")
          }
        } else if (e.response.status === 401) {
          alert("Vous êtes déjà connecté.")
        } else {
          alert("Une erreur est survenue")
        }
      }
    },
    async getUser () {
      const res = await axios.get('/api/me')
      this.user = res.data
    },
    async addarticle (newarticle, id_user) {
      let video_embed;
      try {
        // on transforme un simple lien youtube en embed youtube
        video_embed = newarticle.video_link.split('/embed').join('');
        video_embed = video_embed.replace('watch?v=', '');
        video_embed = [video_embed.slice(0, 23), "/embed", video_embed.slice(23)].join('');

        await axios.post('/api/addarticle', {
          id_user: id_user,
          title_article: newarticle.title,
          game: newarticle.game,
          content_text: newarticle.content,
          price: newarticle.price,
          cover: newarticle.cover,
          article_link: video_embed
          })
        alert("Votre article a bien été publiée !")
        window.location.hash = "#/" //On renvoie l'utilisateur sur la page d'accueil
      } catch (e) { //Gestion des erreurs de l'API
        if (e.response.data.message.includes("please include an existing game name")) {
          alert("Merci d'entrer un nom de jeu valide.")
        } else if (e.response.data.message.includes("please respect price field validation (hh:mm:ss)")) {
          alert("Merci d'entrer un prix de article valide .")
        } else {
          alert("Une erreur est survenue lors de l'ajout, veuillez rééssayer.")
        }
      }

    },
    async addtobasket ( id_user,id_article,number) {
      try {

        await axios.post('/api/addtobasket', {
          id_user: id_user,
          id_article: id_article,
          number: number

        })
        alert("Votre article a bien été ajouter au panier !")
      } catch (e) { //Gestion des erreurs de l'API
          alert("Une erreur est survenue lors de l'ajout, veuillez rééssayer.")
      }

    },async delltobasket (art, id_user) {
      try {

        await axios.post('/api/delltobasket', {
          id_user: id_user,
          id_article: art.id_article,
          number: art.number

        })
      } catch (e) { //Gestion des erreurs de l'API
        alert("Une erreur est survenue lors de la supretion, veuillez rééssayer.")
      }

    },
    async updatearticle (newarticle, id_user, id) {
      try {
        let video_embed = newarticle.article_link.split('/embed').join('')
        video_embed = video_embed.replace('watch?v=', '');
        video_embed = [video_embed.slice(0, 23), "/embed", video_embed.slice(23)].join('');
        await axios.patch('/api/articlemodif', {id_user: id_user, title_article: newarticle.title, content_text: newarticle.content, price: newarticle.price, cover:newarticle.cover, article_link:video_embed, id_article: id})
        alert("Vos mises à jour ont bien été prises en compte.")
        window.location.reload()
      }
      catch (e) { //Gestion des erreurs de l'API
        alert("Une erreur est survenue, veuillez rééssayer.")
      }
    },
    async deleteUser (username, password) {
      try {
        await axios.delete('/api/user', { params: {
            username: username,
            password: password,
          }})
        window.location.hash = "#/"
      }
      catch (e) { //Gestion des erreurs de l'API
        if (e.response.data.message.includes("bad request - invalid password")) {
          alert("Mauvais mot de passe.")
        } else {
          alert("Une erreur s'est produite ")
        }
      }

    },
    async deleteArticle (id_article) {
      try {
        await axios.delete('/api/article', {params: {
            id_article: id_article,
          }})
        window.location.hash = "#/"
      }
      catch (e) { //Gestion des erreurs de l'API
        if (e.response.data.message.includes("bad request - invalid user")) {
          alert("Utilisateur invalide.")
        } else {
          alert("Une erreur s'est produite ")        }

      }
    },
    async editUser (username, password, newpassword) {
      try {
        await axios.patch('/api/user_mdp', { params: {
            username: username,
            password: password,
            new_password: newpassword,
          }})
        window.location.hash = "#/"
      }
      catch (e) { //Gestion des erreurs de l'API
        if (e.response.data.message.includes("bad request - invalid password")) {
          alert("mauvais mot de passe.")
        } else {
          alert("une erreur c'est produite ")        }

      }
    },
    async disconnect () {
      await axios.post('/api/disconnect');
      window.location.hash = "#/login";
      window.location.reload();
    },
    async tobasket () {
      window.location.hash = "#/basket";
      window.location.reload();
      console.log('ssssss')

    }
  }
})
