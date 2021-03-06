const PostService = require('../services/post');

module.exports = {
    getPosts: async (req, res, next) => {
        try {
            const { limit, offset, sort } = req.query;
            const posts = await PostService.getPosts({ limit, offset, sort });
            res.json({
                data: posts.current,
                totalCount: posts.total,
            });
        } catch (err) {
            return next(err);
        }
    },

    getPostById: async (req, res, next) => {
        try {
            const post = await PostService.getPostById(req.params.postId);
            res.json({ data: post });
        } catch (err) {
            return next(err);
        }
    },

    createPost: async (req, res, next) => {
        try {
            const { title, type, content, user } = req.body;
            const payload = { title, type, content, user };
            const post = await PostService.createPost(payload);
            res.json({ data: post });
        } catch (err) {
            return next(err);
        }
    },

    updatePost: async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const { title, type, content, user } = req.body;
            const post = await PostService.updatePost({
                postId,
                title,
                type,
                content,
                user,
            });
            res.json({ data: post });
        } catch (err) {
            return next(err);
        }
    },

    deletePost: async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const { user } = req.body;
            await PostService.deletePost({ postId, user });
            res.json({ message: 'Post deleted!' });
        } catch (err) {
            return next(err);
        }
    },

    upvotePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await PostService.upvotePost(postId);
            res.json({ data: { voteCount: post.score } });
        } catch (err) {
            next(err);
        }
    },

    downvotePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await PostService.downvotePost(postId);
            res.json({ data: { voteCount: post.score } });
        } catch (err) {
            next(err);
        }
    },

    searchPost: async (req, res, next) => {
        try {
            const term = req.query.q;
            const result = await PostService.searchPost(term);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};
