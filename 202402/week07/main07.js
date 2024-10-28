const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySqlStore = require('express-mysql-session')(session);
var db = require('./lib/db');

var options = {
    host : 'localhost',
    user : 'nodejs',
    password: 'nodejs',
    database: 'webdb2024'
};

var sessionStore = new MySqlStore(options);
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret : 'keyboard cat', //(필수) 암호화하는데 필요한 정보
    resave : false, 
    saveUninitialized: true,
    store: sessionStore
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// const topic = require('./lib/topic');
// const author = require('./lib/author');

var authorRouter = require('./router/authorRouter');
var rootRouter = require('./router/rootRouter');




// app.get('/', (req, res) => {
//     topic.home(req, res)
// })


// app.get('/page/:pageId', (req, res) => {
//     topic.page(req, res)
// })

app.use('/', rootRouter);
app.use(('/author', authorRouter));

//정적파일
app.use(express.static('public'));

// app.get('/create', (req, res) => {
//     topic.create(req, res)
// })

// app.post('/create_process', (req, res) => {
//     topic.create_process(req, res)
// })

// app.get('/update/:pageId', (req, res) => {
//     topic.update(req, res)
// })

// app.post('/update_process', (req, res) => {
//     topic.update_process(req, res);
// })

// app.get('/delete/:pageId', (req, res) => {
//     topic.delete_process(req, res);
// })

// app.get('/login', (req,res)=>{
//     topic.login(req,res);
// })

// app.get('/author',(req,res)=>{
//     author.create(req,res);
// })

// app.post('/author/create_process',(req,res)=>{
//     author.create_process(req,res);
// })

// app.get('/author/update/:pageId',(req,res)=>{
//     author.update(req,res);
// })

// app.post('/author/update_process', (req,res)=>{
//     author.update_process(req,res);
// })

// app.get('/author/delete/:pageId',(req,res)=>{
//     author.delete_process(req,res);
// })

// app.get('/login', (req,res)=>{
//     topic.login(req,res);
// })

// app.post('/login_process', (req,res)=>{
//     topic.login_process(req,res);
// })

// app.get('/logout_process', (req,res)=>{
//     topic.logout_process(req,res);
// })

app.listen(3000, () => console.log('Example app listening on port 3000'));