const LocalStrategy = require('passport-local').Strategy
const User = require('./models/User')

function initialize(passport) {
    passport.use(new LocalStrategy({ usernameField: 'usernameoremail', passwordField: 'pwd' }, authenticateUser))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

async function authenticateUser(usernameoremail, password, done) {
    try {
        const user = await User.findOne({
            $or: [
                { username: usernameoremail },
                { email: usernameoremail }
            ]
            })
        
        if(!user)
            return done(null, false, {message: 'No User found'})
        
        if(!(await user.validatePassword(password)))
            return done(null, false, {message: 'Incorrect password'})

        return done(null, user)
    } catch (error) {
        return done(error)
    }
}

// middleware check if user not logged in
function checkNotAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        // block from visiting content for logged-in only
        return res.redirect('/')
    }
    
    next()
}

// middleware check if user logged in
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        // block from visiting login page
        return res.redirect('/')
    }
    
    next()
}

module.exports = {
    initializePassport: initialize,
    checkAuthenticated,
    checkNotAuthenticated
}