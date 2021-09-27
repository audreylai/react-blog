/***********************************************************
 * MODULE DEPENDENCIES
 * express
 * express-session
 * cookie-parser
 * passport
 * passport-local
 * sqlite3
 */

/***********************************************************
 * SETUP AND CONFIGURATION
 ***********************************************************/

// Express.js setup
const express = require('express')
const app = express()
const port = 8080
console.log("Starting up");

// Define default parsing
app.use(express.json()) // Parse any application/json requests into req.body
app.use(express.urlencoded({ extended: true })) // Parse any application/x-www-form-urlencoded requests into req.body
app.use(express.static(__dirname+'static')); // Static files in the ./static folder
app.use(require('express-session')({ secret: '0823hyiorum', resave: false, saveUninitialized: false })); // Session handler
console.log("Parsers set");

// Passport.js setup
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.authenticate('session')); // Logins will remain valid for the current session (until user closes their browser) 
console.log("Passport set");

// File, folder, path setup
const path = require('path');

// SQLite setup
const sqlite3 = require('sqlite3');
const dbFilename = "db.db";
const db = new sqlite3.Database(__dirname+"/"+dbFilename);

// Because of course we will want some cryptonite :p
const crypto = require('crypto');
console.log("All set");

/************** DATABASE INFO **************
 * 
 * Table: users
 * 
 * Fields: userid, password, displayName
 * 
 * Test data:
 * pbaumgarten / letmein1 / Paul Baumgarten
 * audrey / letmein2 / Audrey Lai
 * lacus / letmein3 / Lacus Lee
 * 
 */

/***********************************************************
 * PASSPORT AND LOGIN RELATED FUNCTIONS
 ***********************************************************/

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

function requireLogin(req, res, next) {
    // Will check if the user is logged in
    // Refer to /secure route to see it being inserted into the render process
    console.log("requireLogin: Checking for the presence of req.user");
    console.log(req.user);
    if (req.user) {
        next();
    } else {
        console.log("Login required you rascally wabbit")
        res.redirect('/login');
    }
}

passport.serializeUser(function(user, done) {
    // Convert user object to user id for saving into session cookie
    console.log("serialising (saving into the session)...",user);
    done(null, user.userid);
});
  
passport.deserializeUser(function(userid, done) {
    // Convert user id (from session cookie) to user object. Will be attached to req.user
    console.log("deserialising (retrieving user object)... ");
    console.dir(userid);
    db.get("SELECT * FROM users WHERE userid=?", userid, function(err, row) {
        if (! row) { return done(null, false); }
        return done(null, row);
    })
});


// Defines how a user is authenticated
// Is called by passport.authenticate() in the /login route
passport.use( new LocalStrategy( 
  { // Specify the fields to find within req.body
    usernameField: 'userid',
    passwordField: 'passwd'
  }, 
  // Handling function
  function(uid, pwd, done) {
    console.log(`Login request....`);
    console.log(`userid ${uid}`);
    console.log(`passwd ${pwd}`);
    db.get("SELECT * FROM users WHERE userid=? AND password=?", [uid, pwd], (err, row)=>{
        console.log("row",row);
        // If there is no record matching the username/password, abort
        if (!row) return done(null, false); 
        // If the record exists, return the data for saving into the session
        return done(null, row);
    });
}));

/***********************************************************
 * ROUTES
 ***********************************************************/

app.get('/', (req, res) => {
    console.log("Index page");
    res.send('Welcome to my very exciting website. You probably want to go to /login');
})

// Send the login form
app.get('/login', (req, res)=> {
    res.sendFile(__dirname+"/login.html");
})

app.get('/loginfail', (req, res)=> {
    res.sendFile(__dirname+"/loginfail.html");
})

// Receive login form request from login.html
// Will execute the passport authentication strategy
// On success or failure of the login attempt, will redirect as specified...
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secure',
    failureRedirect: '/loginfail'
}));

// Visiting this page is only allowed if you are logged in
// The requireLogin() function will verify user logged in, and redirect elsewhere if they are not
app.get('/secure', requireLogin, function (req, res) {
    console.log(req.body);
    console.log("Logged in as:");
    console.dir(req.user); // user object should exist when logged in
    // Testing the password hash function. Looks like it works just fine.
    let hash = hashPassword(req.user.password, "tasty salt");
    console.log("hash", hash);
    res.send('My secret content you must be logged in to see.')
})

app.get('/logout', function (req, res) {
    console.log(req.ip)
    console.log('You should now (hopefully) be getting logged out. Ta. Thanks for your visit. Hope your life is now fulfilled.')
    req.logout(); // Passport provided function to end the user session
    res.redirect('/');
})

/***********************************************************
 * START THE SERVER
 ***********************************************************/

/* Start the server, listen to the specified port number, execute the paramter function when running */
app.listen(port, () => {
    console.log(`My sample app listening at http://localhost:${port}`)
})
