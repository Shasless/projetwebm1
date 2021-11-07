const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const dotenv = require('dotenv')
const {compare} = require("bcrypt");
dotenv.config()

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
})

client.connect()

router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu
  next()
})

/**
 * Cette route permet de récupérer une liste d'articles
 * Le body doit contenir d'éventuels paramètres de recherche, ainsi que l'offset de lecture des articles
 */
router.get('/articles', async (req, res) => {
  let offset = 0;
  try {
    offset = req.query.offset;
  } catch (e) {} //Si aucun offset n'est spécifié dans la requête, on va générer une erreur que l'on ignore
  let result;
  let sql = "SELECT id, " +
            "(SELECT username FROM users WHERE id = articles.owner) as owner, " +
            "title, " +
            "(SELECT display_name FROM games WHERE id = articles.game) as game, " +
            "content, price, article_link, cover FROM articles "
  switch (req.query.order_by) {
    case 'game':
      const game = sanitizeGameName(req.query.game);
      sql += "WHERE game = (SELECT id FROM games WHERE name = $1 LIMIT 1) ORDER by id DESC LIMIT 20 OFFSET $2";
      result = (await client.query({
        text: sql,
        values: [game, offset]
      })).rows
      break;
    case 'user':
      const user = req.query.user;
      sql += "WHERE owner = (SELECT id FROM users WHERE username = $1 LIMIT 1) ORDER by id DESC LIMIT 20 OFFSET $2";
      result = (await client.query({
        text: sql,
        values: [user, offset]
      })).rows
      break;
    case 'price':
      sql += " ORDER by price DESC LIMIT 20 OFFSET $1";
      result = (await client.query({
        text: sql,
        values: [offset]
      })).rows
      break;
    default:
      sql += "ORDER by id DESC LIMIT 20 OFFSET $1";
      result = (await client.query({
        text: sql,
        values: [offset]
      })).rows
  }
  res.status(200).json(result)
})

router.get('/basket', async (req, res) => {
  try {
    const id = req.session.userId;
    const sql = "SELECT * FROM basket INNER JOIN articles ON basket.id_article = articles.id WHERE basket.id_user = $1";
    const result = (await client.query({
      text: sql,
      values: [id]
    })).rows;
    res.status(200).json(result);
  } catch (e) {
    res.status(400)
  }
})


/**
 * Cette route permet de récupérer un article particulier en fonction de son id
 * Doit recevoir l'id en paramètre
 */
router.get('/articles/byid', async (req, res) => {
  try {
    const id = req.query.id;
    const sql = "SELECT id, " +
        "(SELECT username FROM users WHERE id = articles.owner) as owner, " +
        "title, " +
        "(SELECT display_name FROM games WHERE id = articles.game) as game, " +
        "content, price, article_link, cover " +
        "FROM articles WHERE id = $1";
    const result = (await client.query({
      text: sql,
      values: [id]
    })).rows;
    res.status(200).json(result);
  } catch (e) {
    res.status(400)
  }
})

/**
 * Cette route permet de récupérer tous les articles publiés par un utilisateur
 */
router.get('/articles/byuser', async (req, res) => {
  try {
    const user = req.query.username;
    const sql = "SELECT id, " +
        "(SELECT username FROM users WHERE id = articles.owner) as owner, " +
        "title, " +
        "(SELECT display_name FROM games WHERE id = articles.game) as game, " +
        "content, price, article_link, cover " +
        "FROM articles WHERE owner = (SELECT id FROM users WHERE username = $1) ORDER by id DESC";
    const result = (await client.query({
      text: sql,
      values: [user]
    })).rows;
    res.status(200).json(result);
  } catch (e) {
    res.status(400);
  }
})

/**
 * Cette route retourne le nombre total d'articles dans la base de données affichables selon les critères de recherche
 * Elle doit recevoir deux paramètres :
 * orderBy: 'game'|'user' ; défini quelle table rechercher (facultatif)
 * searchString: string ; défini le critère de recherche (ignoré si orderBy n'est pas présent)
 */
router.get('/articleQuantity', async (req, res) => {
  let result;
  switch (req.query.orderBy) {
    case 'game':
      const game = sanitizeGameName(req.query.searchString);
      result = ( await client.query({
        text: "SELECT COUNT(*) FROM articles WHERE game = (SELECT id FROM games WHERE name = $1 LIMIT 1)",
        values: [game]
      })).rows[0]
      res.status(200).json(result)
      break;
    case 'user':
      result = ( await client.query({
        text: "SELECT COUNT(*) FROM articles WHERE owner = (SELECT id FROM users WHERE username = $1)",
        values: [req.query.searchString]
      })).rows[0]
      res.status(200).json(result)
      break;
    default:
      result = ( await client.query({
        text: "SELECT COUNT(*) FROM articles"
      })).rows[0]
      res.status(200).json(result)
  }
})

/**
 * Cette route retourne le nom d'affichage d'un jeu ou d'un utilisateur basé sur une partie seulement de son nom
 * Elle doit recevoir deux paramètres :
 * orderBy: 'game'|'user' ; défini quelle table rechercher
 * searchString: string ; défini le critère de recherche
 */
router.get('/searchName', async (req, res) => {
  const order_by = req.query.orderBy;
  if (order_by === 'game') {
    const game = "%" + sanitizeGameName(req.query.searchString) + "%";
    const result = (await client.query({
      text: "SELECT name, display_name FROM games WHERE name LIKE $1",
      values: [game]
    })).rows;
    res.status(200).json(result);
  } else {
    const user = "%" + req.query.searchString + "%";
    const result = (await client.query({
      text: "SELECT username FROM users WHERE username LIKE $1",
      values: [user]
    })).rows;
    res.status(200).json(result);
  }

})


/**
 * Cette route permet d'ajouter un nouvel article/ article
 * Le body doit contenir l'id de l'utilisateur, le titre de la article, le jeu, le contenue, le prix, une image de couverture et le liens vers la video
 */
router.post('/addarticle', async (req, res) => {
  const new_article = req.body;
  let id;
  try{
    id = (await client.query({
      text: "(SELECT id FROM games WHERE display_name = $1 LIMIT 1)",
      values: [
        new_article.game,
      ]
    })).rows[0].id;
  } catch (e) {
    res.status(400).json({message: "bad request - please include an existing game name"});
    return
  }

  const sql_insert = "INSERT INTO articles (owner, title, game, content, price, cover, article_link) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  try {
    await client.query({
      text: sql_insert,
      values: [
          new_article.id_user,
          new_article.title_article,
          id,
          new_article.content_text,
          new_article.price,
          new_article.cover,
          new_article.article_link
      ]
    });
    res.status(200).json({message: "ok"})
  } catch (e) {
    res.status(400).json({message: "bad request"});
  }
})

/**
 * Cette route permet de modifier article/ article
 * Le body doit contenir l'id de l'utilisateur, le titre de la article, le jeu, le contenue, le prix, une image de couverture et le liens vers la video
 */
router.patch('/articlemodif', async (req, res) => {
  //on verifie la presence de la variable essentielle
  if (!req.body.id_user) {
    res.status(400).json({message: "bad request - request must contain an id"});
  }
  else {
    const sql_update = "UPDATE articles set title = COALESCE($1, title), content = COALESCE($2, content), price = COALESCE($3, price), cover = COALESCE($4, cover), article_link = COALESCE($5, article_link) WHERE id=$6 AND owner=$7"
    await client.query({
      text: sql_update,
      values: [req.body.title_article, req.body.content_text, req.body.price, req.body.cover, req.body.article_link, req.body.id_article, req.body.id_user]
    });
    res.status(200).json({message: "ok"});
  }
})

/**
 * Cette route permet d'ajouter un nouvel utilisateur
 * Le body doit contenir l'email et le mot de passe de l'utilisateur
 */
router.post('/register', async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  if(!(email && username && req.body.password)){
    res.status(400).json({message: "bad request - request must include email and password"});
  } else if (username.length > 30) { //Vérifié par le component coté client, mais on revérifie ici car on ne peux pas faire confiance au client pour la validation de données
    res.status(400).json({message: "bad request - username must be shorter than 30 characters"})
  } else {
    const password = await bcrypt.hash(req.body.password, 10);

    const sql_select = "SELECT * FROM users WHERE email=$1 OR username=$2"
    const query = await client.query({
      text: sql_select,
      values: [email, username]
    })

    if (query.rows.length > 0) {
      res.status(400).json({message: "bad request - user already exists"})
    } else {
      try {
        const sql_insert = "INSERT INTO users (email, password, username, admin) VALUES ($1, $2, $3, FALSE)"
        await client.query({
          text: sql_insert,
          values: [email, password, username]
        });
        res.status(200).json({message: "ok"});
      } catch (e) {
        res.status(500).json({message: 'internal server error'})
      }
    }
  }
})

/**
 * Cette router permet d'authentifier un utilisateur
 * Le body doit contenir l'email et le password de l'utilisateur
 */
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (req.session.userId){
    res.status(401).json({message: "already logged in"})
  } else if(!(email && password)){
    res.status(400).json({message: "bad request - request must include email and password"});
  } else {
    const sql = "SELECT * FROM users WHERE email=$1";
    const result = (await client.query({
      text: sql,
      values: [email]
    })).rows
    if (result.length === 1) {
      if (await bcrypt.compare(password, result[0].password)) {
        req.session.userId = result[0].id;
        res.status(200).json({message: "ok"})
      } else {
        res.status(400).json({message: "bad request - invalid password"});
      }
    } else {
      res.status(400).json({message: "bad request - invalid user"});
    }
  }
})

/**
 * Cette route retourne l'utilisateur actuellement connecté
 */
router.get('/me', async (req, res) => {
  if(req.session.userId){
    const sql = "SELECT id, email, username, admin FROM users WHERE id=$1"
    const result = (await client.query({
      text: sql,
      values: [req.session.userId]
    })).rows
    if(result){
      res.status(200).json(result[0]);
    } else {
      res.status(500).json({message: 'internal server error'});
    }
  } else {
    res.status(401).json({message: "no user logged in."});
  }
})

/**
 * Cette route retourne les infos d'un user en fonction de son id
 */
router.get('/user', async (req, res) => {
  if(req.query.username){
    const sql = "SELECT  id, admin FROM users WHERE username=$1"
    const result = (await client.query({
      text: sql,
      values: [req.query.username]
    })).rows
    if(result[0]){
      res.status(200).json(result[0])
    } else {
      res.status(401).json({message: "include a valid username"});
    }
  } else {
    res.status(401).json({message: "include an username"});
  }
})

/**
 * Cette route déconnecte l'utilisateur
 */
router.post('/disconnect', (req, res) => {
  if (req.session.userId) {
    req.session.destroy();
    res.status(200).json({message: `user disconnected`});
  } else {
    res.status(400).json({message: 'bad request - no user logged in.'})
  }
})

/**
 * Cette route permet de suprimer un utilisateur ansi que tout ces articles
 */
router.delete('/user', async (req, res) => {
  const password = req.query.password

  if(req.query.username){
    const sql2 = "SELECT  id, admin, password FROM users WHERE username=$1"
    const result = (await client.query({
      text: sql2,
      values: [req.query.username]
    })).rows

    if(result[0]){
      if (await bcrypt.compare(password, result[0].password)) {

        const sql = "DELETE FROM articles WHERE owner=$1"
        await client.query({
          text: sql,
          values: [result[0].id]
        })

        const sql3 = "DELETE FROM users WHERE id=$1"
        await client.query({
          text: sql3,
          values: [result[0].id]
        })

        res.status(200).json({message: "ok"})

      } else {
        res.status(400).json({message: "bad request - invalid password"});
      }


    } else {
      res.status(401).json({message: "include a valid username"});
    }
  } else {
    res.status(401).json({message: "include an username"});
  }
})

/**
 * Cette route permet de modifier le mot de passe d'un utilisateur
 */
router.patch('/user_mdp', async (req, res) => {
  const password = req.body.params.password
  let new_password = req.body.params.new_password

  if(req.body.params.username){
    const sql2 = "SELECT  id,admin,password FROM users WHERE username=$1"
    const result = (await client.query({
      text: sql2,
      values: [req.body.params.username]
    })).rows
    if(result[0]){
      if (await bcrypt.compare(password, result[0].password)) {

        new_password= await bcrypt.hash(new_password, 10);

        const sql_update = "UPDATE users set password = $1 WHERE  id=$2 "
        await client.query({
          text: sql_update,
          values: [new_password, result[0].id ]
        });

        res.status(200).json({message: "ok"});

      } else {
        res.status(400).json({message: "bad request - invalid password"});
      }


    } else {
      res.status(401).json({message: "include a valid username"});
    }
  } else {
    res.status(401).json({message: "include an username"});
  }
})



/**
 * Cette route permet de suprimer un article
 */
router.delete('/article', async (req, res) => {
  const id_article = req.query.id_article
  if (req.session.userId) {
    const sql = "SELECT username, admin FROM users WHERE id=$1"
    const result = (await client.query({
      text: sql,
      values: [req.session.userId]
    })).rows

    const sql2 = "SELECT owner FROM articles WHERE id=$1"
    const result2 = (await client.query({
      text: sql2,
      values: [id_article]
    })).rows

    if (result[0].admin || result2[0].owner === req.session.userId) {
      const sql = "DELETE FROM articles WHERE id=$1"
      await client.query({
        text: sql,
        values: [id_article]
      })
      res.status(200).json({message: "ok"})
    } else {
      res.status(400).json({message: "bad request - invalid user"});
    }

  } else {
    res.status(401).json({message: "no user logged in."});
  }

})

router.post('/addtobasket', async (req, res) => {
  if (!req.body.id_user ) {
    res.status(400).json({message: "bad request "});
  }
  else {
    const sql = "SELECT * FROM basket WHERE id_user=$1 AND id_article=$2";
    const result = (await client.query({
      text: sql,
      values: [req.body.id_user,req.body.id_article]
    })).rows
    if (result.length === 1) {
      const sql_update = "UPDATE basket set number = $1 WHERE id_user=$2 AND id_article=$3"
      await client.query({
        text: sql_update,
        values: [result[0].number +req.body.number ,req.body.id_user,req.body.id_article]
      });
    }
    else {
      const sql_update = "INSERT INTO basket(id_article,id_user,number) VALUES ($1,$2,$3)"
      await client.query({
        text: sql_update,
        values: [req.body.id_article ,req.body.id_user,req.body.number]
      });
    }
    res.status(200).json({message: "ok"})
  }
})

router.delete('/delltobasket', async (req, res) => {
  if (!req.session.userId ) {
    res.status(401).json({message: "bad request "});
  }
  else {
    const sql = "SELECT * FROM basket WHERE id_user=$1 AND id_article=$2";
    const result = (await client.query({
      text: sql,
      values: [req.session.userId,req.query.id_article]
    })).rows
    if (result.length === 1) {

      const sql2 = "DELETE FROM basket WHERE id_user=$1 AND id_article=$2"
      const result2 =  await client.query({
          text: sql2,
          values: [result[0].id_user,result[0].id_article]
        });
         res.status(200).json({message: "ok"})

    } else {
      res.status(400).json({message: "bad request "});
    }
  }
})

router.delete('/order', async (req, res) => {
  if (!req.session.userId ) {
    res.status(401).json({message: "bad request "});
  }
  else {

    const sql = "SELECT * FROM basket WHERE id_user=$1 ";
    const result = (await client.query({
      text: sql,
      values: [req.session.userId]
    })).rows
    if (result.length >= 1) {
        const sql = "DELETE FROM basket  WHERE id_user=$1 "
        await client.query({
          text: sql,
          values: [req.session.userId]
        });
      res.status(200).json({message: "ok"})


    } else {
      res.status(400).json({message: "bad request "});
    }
  }
})


module.exports = router
function sanitizeGameName(game) {
  const regex_void = /[#_%.*/='"]/g;
  const regex_space = /[\-]/g;
  return game.toLowerCase().replace(regex_void,'').replace(regex_space, ' ')
}
