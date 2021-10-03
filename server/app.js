import express from 'express';
const app = express()
const port = 5000
console.log("Starting up");

// __dirname is missing from modules, create it manually
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("Running from "+__dirname)

// Define default parsing
app.use(express.json()) // Parse application/json data into req.body
app.use(express.urlencoded({ extended: true })) // Parse form data into req.body
app.use('/static', express.static(join(__dirname, 'static'))); // Static files
import expressSession from 'express-session';
app.use(expressSession({ secret: "a secret", resave: false, saveUninitialized: false })); // Session handler
console.log("Parsers set");

// Passport.js setup
// Logins will remain valid for the current session (until user closes their browser)
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
app.use(passport.initialize());
app.use(passport.authenticate('session')); 

// SQLite setup
import Database from 'better-sqlite3';
const dbFilename = "mydatabase.db";
const db = new Database(join(__dirname, dbFilename));

passport.serializeUser(function (user, done) {
  // Convert user object to user id for saving into session cookie
  console.log("serialising (saving into the session)...", user);
  done(null, user.userid);
});

passport.deserializeUser(function(userid, done) {
  // Convert user id (from session cookie) to user object. Will be attached to req.user
  const stmt = db.prepare("SELECT * FROM users WHERE userid=?");
  const row = stmt.get(userid);
  if (! row) { return done(null, false); }
  return done(null, row);
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
    console.log(`passwd ${pwd}`); // Probably shouldn't do this for a real project
    const statement = db.prepare("SELECT * FROM users WHERE userid=? AND password=?");
    try {
      const row = statement.get(uid, pwd);
      console.log(row);
      return done(null, row);
    } catch (err) { // Invalid password will throw error
      console.log(err);
      return done(null, false);
    }
  }));

/***********************************************************
 * ROUTES
 ***********************************************************/

app.get('/', (req, res) => {
  console.log("Index page");
  return res.send('Welcome to my very exciting website. You probably want to go to /login');
})

// Receive login form request from login.html
// Will execute the passport authentication strategy
// On success or failure of the login attempt, will redirect as specified...
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  return res.send(req.user);
});

app.get('/api/user', function (req, res) {
  console.log("/api/user", req.user)
  if (!req.user) return res.json({"status": "not logged in"}); // or should this be a redirect?
  return res.json(req.user);
})

app.get('/api/logout', function (req, res) {
  console.log(req.ip)
  console.log('You should now (hopefully) be getting logged out. Ta. Thanks for your visit. Hope your life is now fulfilled.')
  req.logout(); // Passport provided function to end the user session
  return res.json({"status": "logout successful"}); // or should this be a redirect?
})

app.get('/api/post/get', function (req, res) {
  const stmt = db.prepare("SELECT * FROM posts")
  const rows = stmt.all()
  return res.json(rows)
})

app.post('/api/post/create', function (req, res) {
  let title = req.body.title
  let content = req.body.content
  let userid = req.user.userid
  if (title && content && userid) {
    try {
      const stmt = db.prepare("INSERT INTO posts (userid, title, content) VALUES (?, ?, ?)");
      const result = stmt.run(userid, title, content)
      console.log("Records updated: ",result.changes);
      return res.send("post created");  
    } catch {
      return res.send("unable to create post - database error");
    }
  } else {
    return res.send("unable to create post - missing fields");
  }
})

/***********************************************************
 * START THE SERVER
 ***********************************************************/

/* Start the server, listen to the specified port number, execute the paramter function when running */
app.listen(port, () => {
  console.log(`Blog project listening at http://localhost:${port}`)
})
