const PostService = require('../services/post');
const CommentService = require('../services/comment');

module.exports = {
    getPostComments: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await PostService.getPostById(postId);
            if (!post) {
                throw new Error('Post not found!');
            }

            const { limit, offset, sort } = req.query;
            const comments = await CommentService.getPostComments({
                postId,
                limit,
                offset,
                sort,
            });

            res.json(comments);
        } catch (err) {
            next(err);
        }
    },

    createComment: async (req, res, next) => {
        try {
            const { postId, parentId } = req.params;
            const { content, userId } = req.body;
            const comment = await CommentService.createComment({
                content,
                parentId,
                postId,
                userId,
            });

            res.json(comment);
        } catch (err) {
            next(err);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const { commentId, postId, parentId } = req.params;
            const { content, userId } = req.body;
            const comment = await CommentService.updateComment({
                content,
                commentId,
                parentId,
                postId,
                userId,
            });

            res.json(comment);
        } catch (err) {
            next(err);
        }
    },

    upvoteComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const comment = await CommentService.upvoteComment(commentId);
            res.json({ data: { voteCount: comment.score } });
        } catch (err) {
            next(err);
        }
    },

    downvoteComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const comment = await CommentService.downvoteComment(commentId);
            res.json({ data: { voteCount: comment.score } });
        } catch (err) {
            next(err);
        }
    },
};
