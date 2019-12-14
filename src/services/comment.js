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
    const comment = await CommentModel.findById(id);

    if (!comment) {
        throw new Error('Comment not found!');
    }
    return comment;
};

const checkCommentOwner = (comment, userId) => {
    if (comment.user.toString() != userId) {
        const err = {
            status: 401,
            message: 'Comment does not belong to user!',
        };
        throw err;
    }
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

        if (postId) await PostService.getPostById(postId);
        if (parentId) await getCommentById(parentId);

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

    updateComment: async ({ content, commentId, parentId, postId, userId }) => {
        const comment = await getCommentById(commentId);
        checkCommentOwner(comment, userId);

        if (postId) await PostService.getPostById(postId);
        if (parentId) await getCommentById(parentId);

        await validateComment({
            content,
            parentId,
            postId,
            userId,
        });

        comment.content = content;
        return await comment.save();
    },

    upvoteComment: async commentId => {
        const comment = await getCommentById(commentId);
        comment.score += 1;
        return await comment.save();
    },

    downvoteComment: async commentId => {
        const comment = await getCommentById(commentId);
        comment.score -= 1;
        return await comment.save();
    },
};
