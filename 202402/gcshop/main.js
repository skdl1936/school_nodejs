const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySqlStore = require('express-mysql-session')(session);
var db = require('./lib/db');

var options = {
    host : 'localhost',
    user : 'root',
    password: 'root',
    database: 'webdb2024'
};

const sessionStore = new MySqlStore(options);
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


const authorRouter = require('./router/authRouter');
const rootRouter = require('./router/rootRouter');
const codeRouter = require('./router/codeRouter');
const productRouter = require('./router/productRouter');
const personRouter = require('./router/personRouter');
const boardRouter = require('./router/boardRouter');
const purchaseRouter = require('./router/purchaseRouter');

app.use('/', rootRouter);
app.use('/auth', authorRouter);
app.use('/code', codeRouter);
app.use('/product', productRouter);
app.use('/person', personRouter);
app.use('/board', boardRouter);
app.use('/purchase', purchaseRouter);

//정적파일
app.use(express.static('public'));

//URL 인코딩
// app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Example app listening on port 3000'));