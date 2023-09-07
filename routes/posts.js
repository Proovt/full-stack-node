const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

router.route('/')
    .get(async (req, res) => {
        try {
            const posts = await Post.find()
            res.json(posts)
        } catch (error) {
            res.status(500).send({error: 'Server error'})
        }
    })
    .post(async (req, res) => {
        const title = req.body.title
        const text = req.body.text
        const user = null

        await Post.create({
            title: title,
            text: text,
            author: user
        })
    })

router.route('/:id')
    .get(async (req, res) => {
        const postId = req.params.id
        try {
            const post = await Post.findOne({_id: postId}).populate('author')
            res.json(post)
        } catch (error) {
            res.status(404).send({error: 'Post not found'})
        }
    })
    .put((req, res) => {
        //update Post
    })
    .delete(async (req, res) => {
        const postId = req.params.id
        try {
            await Post.deleteOne({_id: postId})
            res.json({msg: `User with id ${postId} successfully deleted.`})
        } catch (error) {
            res.status(404).send({error: 'Post not found'})
        }
    })

module.exports = router