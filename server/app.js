const express = require('express')
const app = express()
const port = 5000
console.log("Starting up");

// Define default parsing
app.use(express.json()) // Parse any application/json requests into req.body
app.use(express.urlencoded({ extended: true })) // Parse any application/x-www-form-urlencoded requests into req.body
app.use(express.static(__dirname + 'static')); // Static files in the ./static folder
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
const dbFilename = "mydatabase.db";
const db = new sqlite3.Database(__dirname + "/" + dbFilename);

passport.serializeUser(function (user, done) {
  // Convert user object to user id for saving into session cookie
  console.log("serialising (saving into the session)...", user);
  done(null, user.userid);
});

passport.deserializeUser(function (userid, done) {
  // Convert user id (from session cookie) to user object. Will be attached to req.user
  console.log("deserialising (retrieving user object)... ");
  console.dir(userid);
  db.get("SELECT * FROM users WHERE userid=?", userid, function (err, row) {
    if (!row) { return done(null, false); }
    return done(null, row);
  })
});

// Defines how a user is authenticated
// Is called by passport.authenticate() in the /login route
passport.use(new LocalStrategy(
  { // Specify the fields to find within req.body
    usernameField: 'userid',
    passwordField: 'passwd'
  },
  // Handling function
  function (uid, pwd, done) {
    console.log(`Login request....`);
    console.log(`userid ${uid}`);
    console.log(`passwd ${pwd}`);
    db.get("SELECT * FROM users WHERE userid=? AND password=?", [uid, pwd], (err, row) => {
      console.log("row", row);
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

// Receive login form request from login.html
// Will execute the passport authentication strategy
// On success or failure of the login attempt, will redirect as specified...
app.post('/api/login', passport.authenticate('local'));

app.get('/api/user', function (req, res) {
  console.log("/api/user", req.user)
  if (!req.user) res.json();
  res.json(req.user)
})

app.get('/api/logout', function (req, res) {
  console.log(req.ip)
  console.log('You should now (hopefully) be getting logged out. Ta. Thanks for your visit. Hope your life is now fulfilled.')
  req.logout(); // Passport provided function to end the user session
})

app.get('/api/post/get', function (req, res) {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows)
  });
})
app.post('/api/post/create', function (req, res) {
  title = req.body.title
  content = req.body.content
  userid = req.user.userid
  if (title && content && userid) {
    db.run("INSERT INTO posts (userid, title, content) VALUES (?, ?, ?)", [userid, title, content], (err) => {
      if (err) console.log(err.message);
    })
  }
})

/***********************************************************
 * START THE SERVER
 ***********************************************************/

/* Start the server, listen to the specified port number, execute the paramter function when running */
app.listen(port, () => {
  console.log(`My sample app listening at http://localhost:${port}`)
})
