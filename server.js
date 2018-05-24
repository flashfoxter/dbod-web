// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Load configuration
var config = require('./server/config');

// Get our API routes
const api = require('./server/routes/api');

// Get auth methods
const oauth = require('./server/auth');

const app = express();

// Sessions
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(session({
    store: new FileStore,
    resave: false,
    secret: 'sessionsecret',
    saveUninitialized: false,
    unset: 'destroy'
    })
);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set our API proxy
app.use('/api/v1', api.router);

// Initial page redirecting to Oauth server
app.get('/login', (req, res) => {
    console.log(oauth.authUri);
    res.redirect(oauth.authUri);
});

app.get('/auth', (req, res) => {
    if (! req.session.isAuthenticated) {
        res.redirect('/login');
    }
    response = {}
    response.isAdmin = req.session.isAdmin
    response.isAuthenticated = req.session.isAuthenticated
    response.username = req.session.user.username
    res.send(response)
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', oauth.callback)

// Main App
app.get('/', (req, res) => {
   if (! req.session.isAuthenticated) {
       res.redirect('/login');
   }
   res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/logout', (req, res) => {
    console.log('Destroying session SID: ' + req.session.id); 
    req.session.destroy((error) => {
        if (error) {
        console.log(error)}
        }
    );
    res.send("Bye!");
});

app.set('port', config.port);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

const server = http.createServer(app);

server.listen(config.port, () => console.log(`API running on localhost:${config.port}`));