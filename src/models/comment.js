const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: 'Comment',
        },
        user: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
    },
);

CommentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent',
});

module.exports = mongoose.model('Comment', CommentSchema);
