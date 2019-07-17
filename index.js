//File Location is in Server folder
// All the requires here will load when the app begins
// This file is an index.js but can also be renamed to server.js
const express = require('express')
require('./models/User')
require('./services/passport') // The reason we are not assiging this to a variable is because the file is not returning anything, we just need this to run so we just need to require it.
const mongoose = require('mongoose')
const cookieSession = require('cookie-session') // This is to use cookies logging
const passport = require('passport') // To tell passport to use cookies
const keys = require('./config/keys')


// This is how we connect mongoose
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })

// To make express() equal to app
const app = express()

// This is used to have pssport talk to cookiesession
app.use( // Passing to this function cookieSession. .use is a middleware to wire up things and does pre-processing before sending it out.
    cookieSession({ // Calling cookieSession and call a configuration object that requires two different prpoerties:
        maxAge: 30 * 24 * 60 * 60 * 1000, // How long the cookie can be in the browser before it automatically expires. This is 30 days
        keys: [keys.cookieKey] // This is used to encrypt our cookie so that it is automatically encrypted
    })
)
// This is still/also used to have pssport talk to cookiesession
app.use(passport.initialize())
app.use(passport.session())

// In order to run the routes using the app in used with express, we could create a variable with the require import for app, but a better way to write is to skip creating a new variable and just write this:
require('./routes/authRoutes')(app)


const PORT = process.env.PORT || 5000
app.listen(PORT)