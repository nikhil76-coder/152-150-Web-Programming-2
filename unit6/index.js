const express = require('express');
const app = express();
const http = require('http');

const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// Data
const {video,audio} = require('./models/media');
const {projects} = require('./models/portfolio');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 8080;
app.listen(port);
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
    res.render("portfolio",{title:'My Work', projects:projects});
})

app.get('*', (req,res)=>{
    res.render("notfound",{title:'Sorry, file not found!'});
})
