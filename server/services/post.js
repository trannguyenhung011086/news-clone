const yup = require('yup');
const mongoose = require('mongoose');
const PostModel = require('../models/post');

const UserService = require('./user');

const getPostById = async postId => {
    const id = new mongoose.Types.ObjectId(postId);
    const post = await PostModel.findById(id);

    if (!post) {
        throw new Error('Post not found!');
    }
    return post;
};

const validatePost = async ({ title, type, content, user }) => {
    const findUser = await UserService.getUserById(user);
    if (!findUser) {
        throw new Error('User not found!');
    }

    const payload = { title, type, content, user };
    const schema = yup.object({
        title: yup.string().required(),
        type: yup.string().oneOf(['link', 'text']),
        content: yup.string(),
        user: yup.string().required(),
    });
    await schema.validate(payload);

    return payload;
};

const checkPostOwner = (post, user) => {
    if (post.user.toString() != user) {
        const err = {
            status: 401,
            message: 'Post does not belong to user!',
        };
        throw err;
    }
    return;
};

module.exports = {
    getPosts: async ({ limit, offset, sort }) => {
        return {
            current: await PostModel.find()
                .limit(limit || 10)
                .skip(offset || 0)
                .sort(sort === 'desc' ? { score: -1 } : { createdAt: -1 }),
            total: await PostModel.countDocuments(),
        };
    },

    getPostById,
    validatePost,

    createPost: async ({ title, type, content, user }) => {
        const payload = await validatePost({ title, type, content, user });
        return await PostModel.create(payload);
    },

    updatePost: async ({ postId, title, type, content, user }) => {
        const post = await getPostById(postId);
        checkPostOwner(post, user);

        await validatePost({ title, type, content, user });

        post.title = title;
        post.type = type;
        post.content = content;
        return await post.save();
    },

    deletePost: async ({ postId, user }) => {
        const post = await getPostById(postId);
        checkPostOwner(post, user);

        await PostModel.deleteOne({ _id: postId });
    },

    upvotePost: async postId => {
        const post = await getPostById(postId);
        post.score += 1;
        return await post.save();
    },

    downvotePost: async postId => {
        const post = await getPostById(postId);
        post.score -= 1;
        return await post.save();
    },

    searchPost: async term => {
        return await PostModel.find({
            $text: { $search: term },
        });
    },
};
