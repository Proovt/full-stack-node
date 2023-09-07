const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: String,
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', postSchema)