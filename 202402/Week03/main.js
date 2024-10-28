const express = require('express');
const app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database: 'webdb2024'
});

connection.connect();


app.get('/', (req, res) =>{
    
    connection.query("select * from topic", (error, results)=>{
        var list = '<ol type=1>';
        var i = 0;
        while(i < results.length){
            list += `<li><a href="#">${results[i].title}</a></li>`
            i++
        }
        list += '</ol>'
        var context = {
            list:list,
            title:'welcome'
        };
        console.log(context.list);
        res.render('home', context, (err,html)=>{
            res.end(html)
        })
    });
    connection.end();

})

app.get('/home/test', (req,res)=>{
    var context = {
        title : "Test입니다."
    };
    res.render('test',context, (err,html)=>{
        res.end(html);
    })

});

app.get('/favicon.ico', (req,res) => res.writeHead(404));
app.listen(3000, ()=> console.log('Example app listening on port 3000'));