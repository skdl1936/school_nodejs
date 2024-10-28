const express = require('express');
const app = express();
var urlm = require('url');
app.get('/main', (req,res) =>{
    var _url = req.url;
    var queryData = urlm.parse(_url,true).query
    var title = 'No query String'
    
    if(queryData.id === undefined)
        title = 'No query String'
    else 
        title = 'query string is ' + queryData.id

    res.send("I endtered in main, "+ title);
})

app.get('/:tblnm/:kind', (req,res) =>{
    var _url = req.url;
    // var queryData = urlm.parse(_url,true).query
    var getParam = req.params.name;
    var getParamID = req.param
    // var tblnm = req.params.tblnm
    // var kind = req.params.kind
    // // 이런형식으로 DB접근을 할수 있음
    // if (tblnm === 'cutomer_tbl' && kind === 'update')
    //     sql = 'update ,,,'
    // else (tblnm === 'cutomer_tbl' && kind === 'delete')
    //     sql = 'delete ....'

    // if(queryData.id === undefined)
    //     title = 'No query String'
    // else 
    //     title = 'query string is ' + queryData.id

    var tmp = 'I entered in main, query String is ' + getParam + ', ' + getParamID
    res.send(tmp)
})


app.get('/:id', (req,res) =>{
    var _url = req.url;
    var title = 'welcom';
    var queryData = urlm.parse(_url,true).query
    var getParamID = req.params.id;
    if (getParamID === undefined){
        title = 'welcom';
    }
    else
        title = getParamID;
    var template = `
    <!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WEB1-${title}</title>
</head>

<body>
<h1><a href="05-index.html">${title}</a></h1>
<ol>
    <li><a href="?id=HTML">HTML</a></li>
    <li><a href="?id=CSS">CSS</a></li>
    <li><a href="?id=JavaScript">JavaScript</a></li>
</ol>
<h2>${title}</h2> // ④ HTML에서 변수사용
<p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language
        (HTML)</a> is
    the standard markup language for <strong>creating <u>web</u>
        pages</strong> and web applications.Web browsers receive HTML
    documents from a web server or from local storage and render them into
    multimedia web pages. HTML describes the structure of a web page
    semantically and originally included cues for the appearance of the
    document.
    <img src="05-coding.jpg" width="100%">
</p>
<p style="margin-top:45px;">HTML elements are the building
    blocks of HTML pages. With HTML constructs, images and other objects,
    such as interactive forms, may be embedded into the rendered page. It
    provides a means to create structured documents by denoting structural
    semantics for text such as headings, paragraphs, lists, links, quotes
    and other items. HTML elements are delineated by tags, written using
    angle brackets.
</p>

</body>

</html>`;
res.send(template);

} );
app.get('/favicon.ico', (req,res) =>res.writeHead(404));
app.listen(3000, ()=>console.log('Welcom ! My Web Site'))
