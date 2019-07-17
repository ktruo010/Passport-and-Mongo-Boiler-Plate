// File Location server > services > passport.js
// This file will hold all the passport configurations for our app
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')

const User = mongoose.model('users') // Normally we would require the actual models file to push the accessToken, refreshToen, and/or profile info to mongo, BUT, we are doing this instead so that in the future if we ever use any sort of testing code like mocha, the system wont get confused and think there are multiple 'users' collections. The reason that mongoose knows the 'users' schema is because in the User model, we wrote 'mongoose.model('users', userSchema)' which lads the users schema INTO mongoose

passport.serializeUser((user, done) => { // The user in this first argument is the user that we pulled out of the database where it says '.then(user => done(null, user))' below. The purpose of using serializeUser fucntion is to grab the user by their mongo object _id and puts it in the cookie.
    done(null, user.id) // This user.id is not the same as the googleID inside the profile. This ID is the object _id in mongo.
})

passport.deserializeUser((id, done) => { // deseriallizeUser is used to take what is in the cookie to pull data. So the first argument is the id in the token (the user.id). The second argument is the 'done'. Whereas with erializeUser we turned the mongo _id into the cookie, here we are doing the opposite and turning the id into the mongo instance.
    User.findById(id)
    .then(user => {  // Remember anytime we access our mongodatabase it is a async action, so it returns a promise, so we need a .then()
        done(null, user)
    })
})

// The clientID and clientSecret is taken from the keys.js file. The callbackURL is what is used to let google know where to go and put the verification code when someone is trying to login. Inside console.developers.google.com within the ""Authorized redirect URIs" make sure you also put in the URI: http://localhost:5000/auth/google/callback
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        // Here you can see what comes back after the "'/auth/google'" and "'/auth/google/callback'" routes located in the routes folder under authRoutes.js. The console.logs show the access token and refresh token. The profile comes back with all the user's information such as email, name,  prfile pic, etc. in json format.
        // console.log('access token: ', accessToken) // Provides the google unique ID that never changes
        // console.log('refresh token: ', refreshToken)
        // console.log('profile: ', profile) // Provides the JSON profile information
        User.findOne({ googleId: profile.id }) // This code is to find if a google ID already exists. Everytime we reach out to the database we are initiating an async function. So it has to return a promise.
        .then((existingUser) => {
            if(existingUser) {
                // We already have a record with a givien profile ID
                done(null, existingUser) // Inside the done(), the first argument is for if something went wrong. Since this done is located where the user has been found, we will put 'null' there. The second argument is for when things go right, so we will pass the existingUser.
            } else {
                // We do not have this user created yet so create a new user
                new User({ googleId: profile.id }).save() // This is set but does not yet initiate the save to the mongo database unless you have the .save()
                .then(user => done(null, user))
            }
        })
    })
)