
const models = require('../models/index');
const Post = models.posts;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { users } = require('../models/index');


//AFFICHER UN POST
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id }
  })
    .then((post) => res.status(200).json(post))
    .catch(error => res.status(400).json({ error: error }))
}

// CREER UN POST
exports.createPost = (req, res, next) => {
  if (!req.body.content) {
    req.body.content = "";
  }
  if (req.file) {
    Post.create({
      userId: req.auth.userId,
      content: req.body.content,
      status: req.body.status,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
      .then(() => res.status(201).json({
        message: 'post créé !'
      }))
      .catch((error) => res.status(400).json({
        error,
        message: 'Vous ne pouvez pas publier un post'
      }))
  } else {
    Post.create({
      userId: req.auth.userId,
      content: req.body.content,
      status: req.body.status,
      imageUrl: null,
    })
      .then(() => res.status(201).json({
        message: 'post créé !'
      }))
      .catch((error) => res.status(400).json({
        error,
        message: 'Vous ne pouvez pas publier un post'
      }))
  }
}

exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      model: users,
      attributes: ['id', 'firstName', 'lastName']
    },]
  })
    .then(posts => { res.status(200).json(posts); })
    .catch(error => res.status(500).json({ error, message: error.message }));
};
//supprimer un post
exports.deletePost = (req, res, next) => {
  Post.findByPk(req.params.id)
    .then(posts => {
      if (posts.userId !== req.auth.userId && !req.auth.admin) {
        return res.status(403).json({
          error: new Error('Unauthorized request!')
        })
      } else {
        Post.destroy({ where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(400).json({ error }));

      }
    })
    .catch(error => res.status(500).json({ error }))
    ;
}

//MODIFIER SON POST
exports.updatePost = (req, res, next) => {
  const postObject = req.file ? {
    ...req.body.posts,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Post.findOne({ where: { id: req.params.id } })

    .then((posts) => {
      console.log(posts);
      if (posts.userId !== req.auth.userId) {
        return res.status(403).json({
          error: new Error('Unauthorized request!')
        });
      }
      Post.update({ ...postObject }, { where: { id: req.params.id } })
        .then((posts) => res.status(200).json({
          message: 'Post modifié !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    });
}