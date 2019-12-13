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
};
