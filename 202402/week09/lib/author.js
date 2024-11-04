var db = require('./db')
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html')
var cookie = require('cookie');


function authIsOwner(req,res){
    var isOwner = false;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    if(cookies.email === 'asdf@asdf.com' && cookies.password === '1234'){
        isOwner = true;
    }

    return isOwner;
}

function nologin_back(req,res){
    if(authIsOwner(req,res) === false){
        res.end(`
            <script type = 'text/javascript'>
                alert('login required');
                setTimeout('location.href="http://localhost:3000/"', 1000)
            </script>
            `)
    }
}

function authStatusUI(req,res){
    var login = '<a href = "/login">login</a>';
    if(authIsOwner(req,res)){
        login='<a href = "/logout_process">logout</a>'
    }
    return login;
}


module.exports= {
    create: (req,res)=>{
        var login = authStatusUI(req,res);
        db.query('select * from topic', (err,topics)=>{
            if(err){throw err}
            db.query('select * from author', (err2,authors)=>{
                if(err2){throw err2}
                var i = 0;
                var tag = '<table border="1" style = "border-collapse: collapse;">';
                for(i = 0; i<authors.length; i++){
                    tag += `
                    <tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td><a href="/author/update/${authors[i].id}">update</a></td>
                        <td><a href="/author/delete/${authors[i].id}" onclick=
                            'if(confirm("정말로 삭제하시겠습니까?") == false){return false}'>delete</a>
                        </td>
                    <tr>`
                }
                tag += '</table>'
                var b = ``;

                if(authIsOwner(req,res)){
                    b = `<form action='/author/create_process' method='post'>
                                <p><input type='text' name='name' placeholder='name'></p>
                                <p><input type='text' name='profile' placeholder='profile'></p>
                                <p><input type='submit' value='저자생성'></p>
                            </form>`;
                }
                
                var context = {
                    title: "AUTHOR 생성화면",
                    login: login,
                    list: topics,
                    menu: tag,
                    body: b
                }
                res.render('home',context,(err,html)=> res.end(html))
            })//두번째 쿼리
        })//첫번쨰 쿼리
    },

    create_process: (req,res)=>{
        var body = '';
        req.on('data',(data)=>{
            body += data;
        });
        req.on('end',()=>{
            var post = qs.parse(body);
            var sanitizedName = sanitizeHtml(post.name);
            var sanitizedProfile = sanitizeHtml(post.profile);
            db.query(`insert into author (name, profile) values(?,?)`,
                [sanitizedName,sanitizedProfile],(err,result)=>{
                    if(err){
                        throw err
                    }
                    res.redirect('/author')
                    res.end();
                }// 첫번쨰 쿼리 종료
            )
        })
    },

    update:(req,res)=>{
        nologin_back(req,res);
        var login = authStatusUI(req,res);
        var id = req.params.pageId;
        db.query('select * from topic', (err1, topics)=>{
            if(err1){throw err1}
            db.query('select * from author', (err2, authors)=>{
                if(err2){ throw err2 }
                db.query('select * from author where id = ?', [id], (err3, author)=>{
                    var tag = ``;
                    var i = 0;
                    while(i < authors.length){
                        tag +=
                        `<tr>
                            <td>${authors[i].name}</td>
                            <td>${authors[i].profile}</td>
                            <td><a href="/author/update/${authors[i].id}">update</td>
                            <td><a href="/author/delete/${authors[i].id}" onclick='if(confirm("정말로 삭제하시겠습니까?") == false){return false}'>delete</td>
                        </tr>`
                        i++;
                    }
                    var m = `
                    <table border= "1" style = "border-collapse: collapse;">
                        ${tag}
                    </table>
                    `;
                    var b = `
                        <form action='/author/update_process' method='post'>
                            <input type = 'hidden' name = 'id' value='${id}'>
                            <p>수정할 이름 입력     : <input type='text' name = 'name' value = ${author[0].name} /></p>
                            <p>수정할 프로필 입력   :<input type='text' name = 'profile' value = ${author[0].profile} /></p>
                            <p><input type='submit' value='저자수정' /></p>
                        </form>
                    `;

                    var context = {
                        title: "AUTHOR 수정화면",
                        login: login,
                        list: topics,
                        menu: m,
                        body: b
                    };
                    

                    res.render('home', context, (err,html)=>res.end(html));
                })
            })
        })
    },

    update_process:(req,res)=>{
        var body =``;
        req.on('data',(data)=>{
            body += data;
        });
        req.on('end', ()=>{
            var post = qs.parse(body)
            var sanitizedName = sanitizeHtml(post.name);
            var sanitizedProfile = sanitizeHtml(post.profile);
            db.query('update author set name = ? , profile = ? where id = ?',
                [sanitizedName, sanitizedProfile, post.id], (err,result)=>{
                    if(err){throw err}
                    
                    res.redirect('/author');
                    res.end();
                })


        })
    },

    delete_process:(req,res)=>{
        if(authIsOwner(req,res) === false){
            nologin_back(req,res);
            return ;
        }
        var id = req.params.pageId;
        db.query(`delete from author where id = ?`, [id] , (err, result)=>{
            if(err){throw err};
            res.redirect("/author");
            res.end();
        })
    }
}


