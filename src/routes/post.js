const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth');

const PostController = require('../controllers/post');
const CommentController = require('../controllers/comment');

router.get('/', PostController.getPosts);
router.get('/:postId', PostController.getPostById);
router.post('/create', AuthMiddleware.isUser, PostController.createPost);
router.put('/:postId', AuthMiddleware.isUser, PostController.updatePost);
router.delete('/:postId', AuthMiddleware.isUser, PostController.deletePost);

router.get('/:postId/comments', CommentController.getPostComments);

module.exports = router;
