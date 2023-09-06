if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const mongoose = require('mongoose')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')

/* static files */
app.use(express.static('public'))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('connected to database'))

app.use('/', indexRouter)

app.listen(process.env.PORT || 8000)