const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.post('/login', async (req, res) => {
    const usernameoremail = req.body.usernameoremail
    const pwd = req.body.pwd

    const user = await User.findOne({
        $or: [
          { username: usernameoremail },
          { email: usernameoremail }
        ]
      })

    if(!user) {
        return res.status(404).render('users/login', {usernameoremail, error: 'No user found'})
    }

    if(await user.validatePassword(pwd)) {
        res.redirect('/')
    } else {
        res.status(400).render('users/login', {username, error: 'Wrong passwords'})
    }
})

router.post('/register', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const pwd = req.body.pwd
    const pwd_repeat = req.body.pwd_repeat

    if(!username || !email || !pwd || !pwd_repeat) {
        return res.status(400).render('users/register', {username, email, pwd, error: 'Invalid Input'})
    }

    if(!/^[a-zA-Z0-9_äöüÄÖÜ]{1,20}$/.test(username)){
        return res.status(400).render('users/register', {username, email, pwd, error: 'Invalid Username: Use letters, numbers and underscores only. The length should be between 1 and 20 letters.'})
    }

    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).render('users/register', {username, email, pwd, error: 'Invalid Email'})
    }

    if(pwd !== pwd_repeat) {
        return res.status(400).render('users/register', {username, email, error: 'Passwords do not match'})
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    })

    if(!!user) {
        return res.status(400).render('users/register', {username, email, pwd, error: 'Username or Email already taken'})
    }

    try {
        await User.create({
            username,
            email,
            password: pwd
        })
        res.redirect('/')
    } catch (error) {
        res.status(500).render('users/register', {username, email, error: 'Server error: Please try again later' + error})
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

module.exports = router