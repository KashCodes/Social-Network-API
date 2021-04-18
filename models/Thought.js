const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/helpers');
const reactionSchema = require('./Reaction');

// thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            length: 1-280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        // Connecting the Reactions to Thought
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// "Tally" or count of friends
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// create the User model using the UserSchema
const Thought = model('Thought', thoughtSchema);

// export the User model
module.exports = { Thought };