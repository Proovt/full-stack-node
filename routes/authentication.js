const express = require('express')
const passport = require('passport')
const User = require('../models/User')
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../passport-config')

router.delete('/logout', checkNotAuthenticated, (req, res) => {
    req.logOut(err => console.log(err))
    res.redirect('/')
})

router.use(checkAuthenticated)

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))

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

    const otherUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if(!!otherUser) {
        return res.status(400).render('users/register', {username, email, pwd, error: 'Username or Email already taken'})
    }

    try {
        const user = await User.create({
            username,
            email,
            password: pwd
        })
        req.login(user, (err) => {
            if(err) {
                return res.status(500).render('users/register', {
                    username,
                    email,
                    pwd,
                    error: 'Internal Server Error. Try again later.',
                });
            }
            return res.redirect('/');
        })
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