const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const textObj = {text: 'world'}
    if(req.isAuthenticated()) {
        textObj.loggedInText = "Hello " + req.user.username 
            + "id: " + req.user._id
    }
    res.render('index', textObj)
})

module.exports = router