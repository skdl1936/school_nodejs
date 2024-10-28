const express = require('express');
const app = express();

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

const todo = require('./lib/05');

app.get('/',(req,res)=> {
    todo.home(req,res)
})

app.get('/page/:pageId', (req,res)=>{
    todo.page(req,res);
})

app.get('/create',(req,res)=>{
    todo.create(req,res)
})

app.post('/create_process',(req,res)=>{
    todo.create_process(req,res);
})

app.get('/update/:pageId', (req,res)=>{
    todo.update(req,res)
})

app.post('/update_process',(req,res)=>{
    todo.update_process(req,res);
})


app.listen(3000, ()=> console.log(`Example app listening on port 3000`));

