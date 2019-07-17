//File Location in models folder named User.js
const mongoose = require('mongoose')
const { Schema } = mongoose // This is the same thing as const Schema = mongoose.Schema

const userSchema = new Schema({
    googleId: String
})

// To create a model class so that mongoose is aware that this collection needs to be created:
mongoose.model('users', userSchema) // This creates a collection called 'users' and the 'userSchema' is the schema above