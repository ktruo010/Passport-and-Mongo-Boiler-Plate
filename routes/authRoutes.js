// File location: Server > routes > authRoutes.js
const passport = require('passport')

module.exports = app => {
    // This is the route that will initiate the google authentication. When it see the "passport.authenticate('google',", it will know to process the "new GoogleStrategy" use function located on the passport.js on the services folder. It is triggered when someone goes to "localhost:5000/auth/google"
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
        })
    )

    // "/auth/google/callback" is the URL that gets redirected to when google proides the accessToke, which will be on the URL. This part is to take that accessToken submit it back to google to authenticate that that is the token they provided so that we can now access the user's data. The "passport.authenticate('google')" is what will check back with Google.
    app.get('/auth/google/callback', passport.authenticate('google'))

    // Used to logout
    app.get('/api/logout', (req, res) => {
        req.logout() // logout is a function attached to passport and it kills the cookies
        res.send(req.user)
    })

    // This is to see the mongo document on the screen
    app.get('/api/current_user', (req, res) => {
        res.send(req.user)
    })
}