var db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');


module.exports = {
    home: (req, res) => {
        db.query('select * from topic', (error, topics) => {
            var m = '<a href = "/create"> create </a>'
            var b = '<h2> Welcome </h2> <p>Node.js Start Page</p> '

            if (topics.length == 0) {
                b = '<h2> Welcome</h2><p>자료가 없으니 create 링크를 이용하여 자료를 입력하세요</p>'
            }
            
            var context = {
                title: "TOPIC 홈화면",
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
        var id = req.params.pageId;

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
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });

        req.on('end', () => {
            var post = qs.parse(body);
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
        });

    },//create_process 끝

    update: (req, res) => {
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
        var body = '';
        req.on('data', (data) => {
            body += data;
            console.log(data);
        })
        req.on('end', () => {
            var post = qs.parse(body);
            console.log(body);
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
        })
    },

    delete_process: (req, res) => {
        var id = req.params.pageId;

        db.query(`delete from topic where id = ?`, [id], (error, result) => {
            if (err) {
                throw error
            }
            res.writeHead(302, { Location: '/' });
            res.end();
        })
    },

}