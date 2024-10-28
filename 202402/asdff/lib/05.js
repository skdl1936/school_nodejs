var db = require('./db');
var qs = require('querystring');

module.exports = {
    home: (req, res) => {
        db.query(`select * from schedule05`, (error, schedules) => {
            var m = "<a href = '/create'>일정생성</a>";
            var d = `<h3>상세일정</h3>
            <p>자료가 없으니 일정생성 링크를 이용하여 자료를 입력하세요.</p>`;

            var context = {
                schedules: schedules,
                menu : m,
                detail: d
            };


            res.render('05', context, (err, html) => {
                res.end(html)
            });
        });

    },

    page:(req,res)=>{
        var id = req.params.pageId;
        db.query('select * from schedule05', (error, schedules)=>{
            if(error){
                throw error
            }
            db.query(`select * from schedule05 where id=${id}`, (err2, schedules)=> {
                var m = `
                <a href="/create">일정생성</a>&nbsp;&nbsp;
                <a href="/update/${schedules[0].id}">일정수정</a>&nbsp;&nbsp;
                <a href="/#">일정삭제</a>&nbsp;&nbsp;
                `;
                var d = `
                <h2> ${schedules[0].title}</h2>
                <p>일정 시작일: ${schedules[0].start}</p>
                <p>일정 종료일: ${schedules[0].end}</p>
                <p>상세 일정: ${schedules[0].content}</p>
                `
                var context = {
                    schedules: schedules,
                    menu : m,
                    detail: d
                };

                res.render('05',context,(err,html)=>{
                    res.end(html)
                })

            })
        })
    },

    create: (req, res) => {

        db.query(`select * from schedule05`, (err, schedules) => {
            var m = "<a href = '/create'>일정생성</a>";
            var d = `<form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="일정제목"></p>
                        <p><input type="text" name="start" placeholder="20241231" length="8"></p>
                        <p><input type="text" name="end" placeholder="20241231" length="8"></p>
                        <p><textarea name="content" placeholder="내용"></textarea></p>
                        <p><input type="submit"></p>
                    </form>`

            var context = {
                schedules:schedules,
                menu: m,
                detail: d
            };

            res.render('05', context, (err,html)=>{
                res.end(html)
            })
        })
    },

    create_process: (req, res) =>{
        var body = '';
        req.on('data', (data)=>{
            body = body + data;
        })

        req.on('end',()=>{
            var post = qs.parse(body);
            db.query(`
                insert into schedule05 (title,start,end,content,created)
                values(?,?,?,?,NOW())`,
                [post.title,post.start,post.end, post.content], (err,result)=>{
                    if(err){
                        throw err;
                    }
                    res.writeHead(302,{Location:`/page/${result.insertId}`});
                    res.end();
                }
            );
        });

    },
    update: (req, res) => {
        var id = req.params.pageId;
        db.query('select * from schedule05', (error, schedules) => {
            if (error) {
                throw error
            }
            db.query(`select * from schedule05 where id = ${id}`, (error2, schedules) => {
                if (error2) {
                    throw error2
                }
                var m = `
                <a href="/create">일정생성</a>&nbsp;&nbsp;
                 <a href="/update/${schedules[0].id}">일정수정</a>&nbsp;&nbsp;<a href="#">delete</a>`
                var d = `
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${schedules[0].id}">
                <p><input type="text" name="title" placeholder="일정제목" value=${schedules[0].title}></p>
                <p><input type="text" name="start" placeholder="20241231" value=${schedules[0].start} length="8"></p>
                <p><input type="text" name="end" placeholder="20241231" value=${schedules[0].end} length="8"></p>
                <p><textarea name="content" placeholder="내용">${schedules[0].content}</textarea></p>
                <p><input type="submit"></p>
                </form>`
                var context = {
                    schedules: schedules,
                    menu: m,
                    detail: d
                };
                res.render('05', context, (err, html) => {
                    res.end(html)
                });
            }); 
        }); 
    },

    update_process: (req, res) => {
        var body = '';
        req.on('data', (data) =>{
            body += data;
        })
        req.on('end', ()=>{
            var post =qs.parse(body);
            db.query('update schedule05 set title = ?,  start= ?, end=?, content=? where id = ?',
                [post.title,post.start,post.end, post.content,post.id] , (err,result)=>{
                    if(err){
                        throw err
                    }
                    res.writeHead(302, {Location: `/page/${post.id}`});
                    res.end();
                }
            )
        })
    }

}