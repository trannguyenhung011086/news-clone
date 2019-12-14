const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth');

const PostController = require('../controllers/post');
const CommentController = require('../controllers/comment');

router.get('/', PostController.getPosts);
router.get('/:postId', PostController.getPostById);
router.post('/create', AuthMiddleware.isUser, PostController.createPost);
router.put('/:postId/update', AuthMiddleware.isUser, PostController.updatePost);
router.delete('/:postId', AuthMiddleware.isUser, PostController.deletePost);

router.get('/:postId/comments', CommentController.getPostComments);

router.post(
    '/:postId/comments/create',
    AuthMiddleware.isUser,
    CommentController.createComment,
);
router.put(
    '/:postId/:commentId/update',
    AuthMiddleware.isUser,
    CommentController.updateComment,
);

router.post(
    '/:parentId/comments/create',
    AuthMiddleware.isUser,
    CommentController.createComment,
);
router.put(
    '/:parentId/:commentId/update',
    AuthMiddleware.isUser,
    CommentController.updateComment,
);

router.post(
    '/:postId/upvote',
    AuthMiddleware.isUser,
    PostController.upvotePost,
);
router.post(
    '/:postId/downvote',
    AuthMiddleware.isUser,
    PostController.downvotePost,
);

router.post(
    '/:commentId/upvote',
    AuthMiddleware.isUser,
    CommentController.upvoteComment,
);
router.post(
    '/:commentId/downvote',
    AuthMiddleware.isUser,
    CommentController.downvoteComment,
);

module.exports = router;
