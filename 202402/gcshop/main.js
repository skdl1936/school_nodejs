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


var authorRouter = require('./router/authRouter');
var rootRouter = require('./router/rootRouter');


app.use('/', rootRouter);
app.use('/auth', authorRouter);

//정적파일
app.use(express.static('public'));

app.listen(3000, () => console.log('Example app listening on port 3000'));