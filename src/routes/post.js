const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');
const AuthMiddleware = require('../middlewares/auth');

router.get('/', PostController.getPosts);
router.get('/:postId', PostController.getPostById);
router.post('/create', AuthMiddleware.isUser, PostController.createPost);
router.put('/:postId', AuthMiddleware.isUser, PostController.updatePost);
router.delete('/:postId', AuthMiddleware.isUser, PostController.deletePost);

module.exports = router;
