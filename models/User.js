const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const HASH_ROUNDS = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: false,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

userSchema.pre('save', async function(next) {
    
    if(!this.isModified('password')) return next()

    try {
        const password = await bcrypt.hash(this.password, HASH_ROUNDS)
        this.password = password
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)