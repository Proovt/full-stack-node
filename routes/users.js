const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).send({error: 'Server error'})
    }
})

router.route('/:id')
    .get(async (req, res) => {
        const userId = req.params.id
        try {
            const user = await User.findOne({_id: userId}).populate({
                path: 'posts',
                limit: 10
            })
            res.json(user)
        } catch (error) {
            res.status(404).send({error: 'User not found'})
        }
    })
    .put((req, res) => {
        //update user
    })
    .delete(async (req, res) => {
        const userId = req.params.id
        try {
            await User.deleteOne({_id: userId})
            res.json({msg: `User with id ${userId} successfully deleted.`})
        } catch (error) {
            res.status(404).send({error: 'User not found'})
        }
    })

module.exports = router