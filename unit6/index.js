const express = require('express');
const app = express();
const  http = require('http');
const server = http.createServer(app);
const  io = require('socket.io')(server);

// const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// Data
const {video,audio} = require('./models/media');
const {projects} = require('./models/portfolio');

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handlebars setting
app.set("view engine","hbs");
app.engine('hbs',exphbs({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'index',
    helpers : {
        //instance level - global helper functions
        counter : (index)=> index + 1,
        speak : ()=> "Hi Earth!"
    }
}));

const port = 8900;
server.listen(port);
console.log(`Listening to server: http://localhost:${port}`);

// Landing page
app.get('/', (req,res)=>{
    res.render("main",{title:'Welcome to my home page!', video:video, audio:audio});
})
 
app.get('/about', (req,res)=>{
    res.render("about",{title:'About Me'});
})

app.get('/contact', (req,res)=>{
    res.render("contact",{title:'Contact Us'});
})

app.get('/portfolio', (req,res)=>{
    res.render("portfolio",{
        title:'My Work', 
        projects:projects,
        helpers: {
            counter: (n)=>++n
        }
    });
})

app.get('/chat', (req,res)=>{
    res.render("chat",{title:'Chat With ME', layout:'chat_main'});
})
app.get('/ajax', (req,res)=>{
    res.render("ajax",{title:'AJAX Operations'});
})
app.get('/crud', (req,res)=>{
    res.render("crud",{title:'CRUD Operations'});
})
app.get('/dragdrop', (req,res)=>{
    res.render("dragdrop",{title:'Drag and Drop Operations'});
})

app.get('*', (req,res)=>{
    res.render("notfound",{title:'Sorry, file not found!'});
})

/* Chat program */
var usernames = {};
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER'
            , username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER'
            , socket.username + ' has disconnected');
    });
});