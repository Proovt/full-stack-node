const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {loggedIn: req.isAuthenticated()})
})

module.exports = router