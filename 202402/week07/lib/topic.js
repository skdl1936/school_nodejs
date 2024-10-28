var db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req,res){
    if(req.session.is_logined)
        return true;
    else
        return false;
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



module.exports = {
    home: (req, res) => {
        db.query('select * from topic', (error, topics) => {
            var login = authStatusUI(req,res);
            var m = '<a href = "/create"> create </a>'
            var b = '<h2> Welcome </h2> <p>Node.js Start Page</p> '

            var context = {
                title: "TOPIC 홈화면",
                login:login,
                list: topics,
                menu: m,
                body: b
            };

            res.render('home', context, (err, html) => {
                res.end(html)
            });
        });
    },

    page: (req, res) => {
        var id = req.params.pageId;
        var login = authStatusUI(req,res);
        db.query('select * from topic', (error, topics) => {
            if (error) {
                throw error
            }
            db.query(`select * from topic
                left join author on topic.author_id = author.id
                 where topic.id = ${id}`, (error2, topic) => {
                var m = `
                <a href="/create">create</a>&nbsp;&nbsp;
                <a href="/update/${id}">update</a>&nbsp;&nbsp;
                <a href="/delete/${id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a>`;
                var b = `<h2> ${topic[0].title} </h2>
                <p>${topic[0].descrpt}</p>
                <p>by ${topic[0].name}</p>`

                var context = {
                    login:login,
                    title: "TOPIC 자료화면",
                    list: topics,
                    menu: m,
                    body: b
                };

                res.render('home', context, (err, html) => {
                    res.end(html)
                })
            });
        })

    },

    create: (req, res) => {
        nologin_back(req,res); // 로그인한 사용자만 생성,갱신, 삭제 하게 해주는 함수
        var login = authStatusUI(req,res);
        db.query(`select * from topic`, (err, topics) => {
            if (err) {
                throw err;
            }
            db.query(`select * from author`, (err2, authors) => {
                var i = 0;
                var tag = '';
                while (i < authors.length) {
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                }
                var m = "<a href='/create'>create</a>"
                var b = `<form action = "/create_process" method = "post">
                            <p><input type = "text" name = "title" placeholder="title"></p>
                            <p><textarea name = "description" placeholder="description"></textarea></p>
                            <p><select name="author">
                                ${tag}
                            </select></p>
                            <p><input type = "submit"></p>
                        </form>
                `
                var context = {
                    login: login,
                    title: "TOPIC 생성화면",
                    list: topics,
                    menu: m,
                    body: b
                };

                res.app.render('home', context, (err, html) => {
                    res.end(html)
                })
            })//두번째 query
        });// 첫번째 query
    },//create 메서드

    create_process: (req, res) => {
        // var body = '';
        // req.on('data', (data) => {
        //     body = body + data;
        // });

        // req.on('end', () => {
            // var post = qs.parse(body);
        var post = req.body;
        var sanitizedTitle = sanitizeHtml(post.title);
        var sanitizedDescription = sanitizeHtml(post.description);
        var sanitizedAuthor = sanitizeHtml(post.author)

        db.query(`
        INSERT INTO topic (title, descrpt, created, author_id)
        VALUES(?, ?, NOW(),?)`,
            [sanitizedTitle, sanitizedDescription, sanitizedAuthor], (error, result) => {
                if (error) {
                    throw error;
                }
                // res.writeHead(302, { Location: `/page/${result.insertId}` });
                res.redirect(`/page/${result.insertId}`)
                res.end();
            }
        );// 첫번째 쿼리 종료
        // });

    },//create_process 끝

    update: (req, res) => {
        nologin_back(req,res);
        var login = authStatusUI(req,res);
        var id = req.params.pageId;
        db.query('select * from topic', (error, topics) => {
            if (error) {
                throw error
            }
            db.query(`select * from topic where id = ?`, [id], (error2, topic) => {
                if (error2) {
                    throw error2
                }
                db.query(`select * from author`, (error3, authors) => {
                    if (error3) { throw error3 }
                    var i = 0;
                    var tag = '';
                    while (i < authors.length) {
                        var selected = '';
                        if (authors[i].id === topic[0].author_id) { selected = 'selected'; }
                        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
                        i++;
                    }

                    var m = `<a href="/create">create</a>&nbsp;&nbsp;
                            <a href="/update/${topic[0].id}">update</a>&nbsp;&nbsp;`;

                    var b = `<form action="/update_process" method="post">
                                <input type="hidden" name="id" value="${id}">
                                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                                <p><textarea name="description" placeholder="description">${topic[0].descrpt}</textarea></p>
                                <p><select name="author">
                                     ${tag}
                                </select></p>
                                <p><input type="submit"></p>
                            </form>`
                    var context = {
                        login: login,
                        title: "TOPIC 수정화면",
                        list: topics,
                        menu: m,
                        body: b
                    };
                    res.render('home', context, (err, html) => {
                        res.end(html)
                    });
                })// 세번째 쿼리
            });//두번째 쿼리문 
        }); //첫번째 쿼리문
    },

    update_process: (req, res) => {
        
        
        var post = req.body;
        var sanitizedTitle = sanitizeHtml(post.title);
        var sanitizedDescription = sanitizeHtml(post.description);
        var sanitizedAuthor = sanitizeHtml(post.author);
        db.query('update topic set title = ?, descrpt = ?,author_id = ? where id = ?',
            [sanitizedTitle, sanitizedDescription, sanitizedAuthor, post.id], (err, result) => {
                if (err) {
                    throw err
                }
                res.writeHead(302, { Location: `/page/${post.id}` });
                res.end();
            }
        )
        
    },

    delete_process: (req, res) => {
        if(authIsOwner(req,res) === false){ // 권한 없는 사용자일경우 
            nologin_back(req,res);
            return;
        }

        var id = req.params.pageId;

        db.query(`delete from topic where id = ?`, [id], (err, result) => {
            if (err) {
                throw err
            }
            res.writeHead(302, { Location: '/' });
            res.end();
        })
    },

    login: (req,res)=>{
        db.query('select * from topic', (err,topics)=>{
            if(err){throw err}
            var login = '<a href="/login">login</a>'
            var m = `<p><a href= '/create'>create</a></p>`;
            var b = `
                <form action = '/login_process' method='post'>
                    <p><input type= 'text'name = 'email' placeholder='email'></p>
                    <p><input type='password' name = 'password' placeholder='password'></p>
                    <p><input type='submit' value='제출' />
                </form>
            `;
    
            var context ={
                login: login,
                title: 'Login ID/PW 입력',
                list: topics,
                menu: m,
                body: b
            }

            res.render('home', context, (err,html)=>{
                res.end(html);
            })

        });
    },

    login_process: (req,res)=>{
        var post = req.body;
        if(post.email === 'asdf@asdf.com' && post.password === '1234'){
            req.session.is_logined = true;
            console.log(req.session.is_logined);
            res.redirect('/');
        }
        else{
            res.end('Who?');
        }
    
    },
    logout_process: (req,res)=>{
        // destory는 session을 삭제해주는 함수
        req.session.destory(((err)=>{
            res.redirect('/');
        }));
    }
}//module