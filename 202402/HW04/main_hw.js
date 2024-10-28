const express = require('express')
const app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database: 'webdb2024'
});

app.get('/', (req, res) =>{
    var context = {
        number: "202239887",
        name: '강태훈',
        header: "## webdb2024에 생성된 테이블 목록"
    };

    res.render('home', context, (err,html)=>{
        res.end(html);
    })
})

app.get('/TOPIC', (req,res) => {
    connection.query('select * from topic', (error, results) =>{
        var list = "<ol type=1>";
        var i = 0;
        while(i < results.length){
            list += `<li><a href="#">${results[i].title}</a></li>`
            i++
        }
        list += "</ol>"

        var context = {
            list: list
        }

        res.render('topic', context, (error, html)=>{
            res.end(html);
        })

    })
})


app.get('/AUTHOR', (req,res)=>{
    
    res.render('author', (error, html) =>{
        res.end(html)
    })
})

app.get('favicon.ico', (req,res) => res.writeHead(404));
app.listen(3000, () => console.log('example app listening on port 3000'));