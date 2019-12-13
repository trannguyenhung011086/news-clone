const yup = require('yup');
const mongoose = require('mongoose');

const CommentModel = require('../models/comment');

const UserService = require('./user');
const PostService = require('./post');

const validateComment = async ({ content, parentId, postId, userId }) => {
    const payload = { content, parentId, postId, userId };
    const schema = yup.object({
        content: yup.string().required(),
        parentId: yup.string(),
        postId: yup.string(),
        userId: yup.string().required(),
    });
    await schema.validate(payload);

    return payload;
};

const getCommentById = async commentId => {
    const id = new mongoose.Types.ObjectId(commentId);
    return await CommentModel.findById(id);
};

module.exports = {
    getCommentById,

    getPostComments: async ({ postId, limit, offset, sort }) => {
        const id = mongoose.Types.ObjectId(postId);
        return {
            postId,
            current: await CommentModel.find({ post: id })
                .limit(limit || 10)
                .skip(offset || 0)
                .sort(sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }),
            total: await CommentModel.find({ post: id }).countDocuments(),
        };
    },

    createComment: async ({ content, parentId, postId, userId }) => {
        const findUser = await UserService.getUserById(userId);
        if (!findUser) {
            throw new Error('User not found!');
        }

        if (postId) {
            const findPost = await PostService.getPostById(postId);
            if (!findPost) {
                throw new Error('Post not found!');
            }
        }

        if (parentId) {
            const findParent = await getCommentById(parentId);
            if (!findParent) {
                throw new Error('Comment not found!');
            }
        }

        await validateComment({
            content,
            parentId,
            postId,
            userId,
        });

        let comment = await CommentModel.create({
            content,
            post: new mongoose.Types.ObjectId(postId),
            user: new mongoose.Types.ObjectId(userId),
        });
        comment = await CommentModel.populate(comment, ['replies', 'user']);
        return comment;
    },
};
