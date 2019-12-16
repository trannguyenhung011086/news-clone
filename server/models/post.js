const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['link', 'text'],
            required: true,
        },
        content: String,
        score: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    {
        toJSON: { virtuals: true },
    },
);

PostSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true,
});

module.exports = mongoose.model('Post', PostSchema);
