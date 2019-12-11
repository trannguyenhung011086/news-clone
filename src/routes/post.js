const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');

router.get('/', PostController.getPosts);
router.get('/:postId', PostController.getPostById);
router.post('/create', PostController.createPost);
router.put('/:postId', PostController.updatePost);
router.delete('/:postId', PostController.deletePost);

module.exports = router;
