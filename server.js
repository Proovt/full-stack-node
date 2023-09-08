if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log('local')
}

const express = require('express')
const app = express()

const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const passport = require('passport')

const {initializePassport, checkAuthenticated, checkNotAuthenticated} = require('./passport-config')
initializePassport(passport)

const indexRouter = require('./routes/index')
const authRouter = require('./routes/authentication')
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('connected to database'))

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.get('*', (req, res) => {
    res.status(404).render('404')
})

app.listen(process.env.PORT || 8000)