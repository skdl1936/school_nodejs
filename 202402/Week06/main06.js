const express = require('express');
const app = express();
var cookie = require('cookie');

app.get('/',function(req,res){
    res.writeHead(200, {
        'set-Cookie' :['cookie1=seoul','cookie2=seongnam']
    });
    console.log(req.headers.cookie)
    if(req.headers.cookie !== undefined){
        var cookies = cookie.parse(req.headers.cookie);
        console.log(cookies)
    }
    res.end('Cookie!!');
});

app.listen(3000, ()=> console.log('cookie Test'));