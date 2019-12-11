const yup = require('yup');
const mongoose = require('mongoose');
const PostModel = require('../models/post');

const UserService = require('./user');

const getPostById = async postId => {
    const id = mongoose.Types.ObjectId(postId);
    return await PostModel.findById(id);
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
        if (!post) {
            throw new Error('Post not found!');
        }
        if (post.user.toString() != user) {
            const err = {
                status: 401,
                message: 'Post does not belong to user!',
            };
            throw err;
        }
        const payload = await validatePost({ title, type, content, user });
        return await PostModel.findOneAndUpdate({ _id: post._id }, payload);
    },

    deletePost: async ({ postId, user }) => {
        const post = await getPostById(postId);
        if (!post) {
            throw new Error('Post not found!');
        }
        if (post.user.toString() != user) {
            const err = {
                status: 401,
                message: 'Post does not belong to user!',
            };
            throw err;
        }

        await PostModel.deleteOne({ _id: postId });
    },
};
