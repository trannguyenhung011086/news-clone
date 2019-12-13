const yup = require('yup');
const mongoose = require('mongoose');

const CommentModel = require('../models/comment');

module.exports = {
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
};
