// Simple Express application
// using the express module from node.js
const express = require('express');
const store = require('./store');
const app = express();
const cookieParser = require('cookie-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Serves the static folder
app.use(express.static('static'));
//app.use(express.static('public'));
//app.use(express.static('authenticated'));

app.use(express.urlencoded({extended: true}));

// Use of cookies after successful authentication
app.use(cookieParser());

// Endpoint to create new users in the database
app.post('/createUser', (req, res) => {
    store.createUser({
        username: req.body.username,
        password: req.body.password
    }).then(() => {
        res.redirect(200, '/');
    });
});

// Endpoint to call the authenticate method in store.js for login
app.post('/login', (req, res) => {
    store.authenticate({
        username: req.body.username,
        password: req.body.password
    }).then(({success}) => {
        if (success) {
            res.cookie('loggedIn', true, { maxAge: 900000, httpOnly: true });
            res.redirect('whiteboard');
        } else {
            res.sendFile(__dirname + '/public/login.html');
        }
    });
});

// Posts users to app.get with the /signUp endpoint
app.post('/signUp', (req, res) => {
    res.redirect('signUp');
});

// Receives requests to the '/' endpoint
// Sends the user to the login.html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Receives requests to the '/whiteboard' endpoint
// Sends the user the whiteboard.html page if already looged in
// Redirects to the login page if the user is not logged in yet
app.get('/whiteboard', (req, res) => {
    if(req.cookies.loggedIn) {
        res.sendFile(__dirname + '/authenticated/whiteboard.html');
    } else {
        res.redirect('/login.html');
    }
});

// Receives requests to the '/signUp' endpoint
// Sends user to the signup.html page
app.get('/signUp', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html')
});

// Receives requests to the 'logout' endpoint
// terminates the cookie and redirects the user to the login page
app.get('/logout', (req, res) => {
    res.clearCookie('loggedIn');
    res.redirect('/');
});

// Websockets listen to 'drawing' and 'erase' from connected users
// Emits to every other user besides the user that emit the message
io.on('connection', function(socket) {
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    socket.on('erase', (data) => socket.broadcast.emit('erase', data));
});

server.listen(process.env.PORT || 8080, () => {
    var port = server.address().port;
    console.log('Server running on ' + port);
});