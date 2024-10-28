var http = require('http'); // require: 외부 모듈을 객체화 해서 가져오는 함수
var fs = require('fs'); // 파일처리 모듈
var urlm = require('url');
// createServer : 객체를 만들어서 리턴
var app = http.createServer(
    // 이 안에는 요청을 받아서 응답하는 콜백함수 정의
    function (req, res) {
        var _url = req.url;
        var queryData = urlm.parse(_url, true).query;
        console.log(queryData);
        console.log(queryData.id);
        console.log(queryData.name);
        var title = queryData.id
        // console.log(_url);

        if (req.url == '/') {
            title = 'welcome'
            // _url = '/index.html'
        }
        if (req.url == '/main/side') {
            // _url = '/index2.html'
        }
        if (_url == '/favicon.ico') {
            return res.writeHead(404);
        }


        res.writeHead(200);
        // console.log(__dirname + _url); // dirname은 현재 파일이 위치한 폴더의 절대경로로 js에서 제공해줌
        // res.end('egoing'); 
        // res.end("Good !!") // 요청에 상관없이 good 이라고 나옴
        // res.end(fs.readFileSync(__dirname + _url));


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

</html>    
        
        `



        res.end(template);
    }

)
app.listen(3000); // 포트 3000번으로 요청 
