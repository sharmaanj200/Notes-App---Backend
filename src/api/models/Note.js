const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    }
}, {
    timestamps: true
});

noteSchema.index({ title: 'text', content: 'text'});
noteSchema.indexes();

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;