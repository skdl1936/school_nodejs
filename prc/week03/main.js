const express = require('express');
const app = express()

// 아래 두 코드가 ejs엔진을 사용하기 위한 코드 
app.set('views', __dirname+'/views'); // ejs를 만들면 현재디렉토리의 하위디렉토리인 views에 저ㅈ아한다.
app.set('view engine', 'ejs'); // view엔진중 ejs를 사용하겠다.

app.get('/', (req,res)=>{
    var context = {
        title : 'Welcome ejs world!!!',
        name : '강태훈'
    };

    // 정보를 보내줄 뷰THML, Data, 콜백함수는 정보를 보내는 작업
    res.render('home', context, (err,html)=>{
        res.end(html);
    });
})

app.get('/:id', (req,res) =>{
    var id = req.params.id;


    var context = {
        title: id,
        name: '강태훈'
    };

    res.render('home', context, (err, html)=>{
        res.end(html)
    })
});

app.get('/favcon.ico', (req,res)=> res.writeHead(404));
app.listen(3000, ()=> console.log('Example app listening on port 3000'));
