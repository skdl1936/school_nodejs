var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
// FileStore를 사용하면 session폴더륾 만들어주며 서버로 값을 가져온다.
// var FileStore = require('session-file-store')(session);

var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    user : 'nodejs',
    password: 'nodejs',
    database: 'webdb2024'
};

var sessionStore = new MySqlStore(options);
var app = express();

// use앞에 첫번째 인자로는 경로가 들어가지만 경로가 없는 경우에는
// 모든 경로에 두번째 인자 함수를 적용한다.
app.use(session({
    secret : 'keyboard cat', //(필수) 암호화하는데 필요한 정보
    resave : false, 
    saveUninitialized: true,
    store: sessionStore
}));

app.use(function(req,res,next){
    console.log(req.session);
    if(!req.session.views){
        req.session.views={};
    }

    var pathname = parseurl(req).pathname;

    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

    next();
});

app.use('/user/:id', function(req,res,next){
    console.log('Request URL:', req.originalUrl);
    // next();
}, function(req,res,next){
    console.log('Request Type:', req.method);
    next();
})


app.get('/foo', function(req,res,next){
    console.log(req.session);
    res.send('you viewed this page' + req.session.views['/foo'] + ' times');
});

app.get('/bar', function(req,res,next){
    res.send('you viewed this page' + req.session.views['/bar'] + ' times');
});

app.listen(3000, function(){
    console.log('3000!')
})