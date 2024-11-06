var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req,res){
    var name = 'Guest';
    var login = false;
    var cls = 'NON'; // 로그인 확인
    if(req.session.is_logined){
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return {name, login, cls};
}


module.exports = {
    view: (req,res)=>{ // code.ejs
        var {name, login, cls} = authIsOwner(req,res);

        var sql1 = 'select * from boardtype;';
        var sql2 = ' select * from code;';

        db.query(sql1 + sql2, (err,results)=>{
            if(err){
                throw err;
            }

            var context = {
                who: name,
                login : login,
                body : 'code.ejs',
                cls : cls,
                boardtypes: results[0],
                codes: results[1]
            };

            req.app.render('mainFrame', context, (err,html)=>{
                res.end(html);
            })
        })
    },

    create: (req,res)=>{ // codeCU.ejs
        var {name, login, cls} = authIsOwner(req,res);

        db.query(`select * from boardtype;`, (err,boardtypes)=>{
            var context = {
                who: name,
                login : login,
                body : 'codeCU.ejs',
                cls : cls,
                check: true, // 입력인지 수정인지 확인
                boardtypes: boardtypes
            };

            req.app.render('mainFrame', context, (err,html)=>{
                res.end(html);
            })
        })

    },

    create_process:(req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var post = req.body;
        var sanM_id = sanitizeHtml(post.main_id);
        var sanS_id = sanitizeHtml(post.sub_id);
        var sanM_name = sanitizeHtml(post.main_name);
        var sanS_name = sanitizeHtml(post.sub_name);
        var sanStart = sanitizeHtml(post.start);
        var sanEnd = sanitizeHtml(post.end);

        db.query(`insert into code values(?,?,?,?,?,?);`,
            [sanM_id,sanS_id,sanM_name,sanS_name,sanStart,sanEnd],(err,result)=>{
            if(err){
                throw err;
            }
            res.redirect('/code/view');
            res.end();
        });
    },

    update : (req,res)=>{ // codeCU.ejs
        var {name, login, cls} = authIsOwner(req,res);
        var sql1 = 'select * from boardtype; ';
        var sql2 =  `select * from code where main_id = ` + req.params.main + ';'
        db.query(sql1 + sql2, (err,results)=>{
                var context = {
                    who: name,
                    login : login,
                    body : 'codeCU.ejs',
                    cls : cls,
                    check: false, // 생성(true)인지 수정(false)인지 확인
                    boardtypes: results[0],
                    code: results[1],
                };

                req.app.render('mainFrame', context, (err,html)=>{
                    res.end(html);
                })
        })

    },

    update_process:(req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);

        var post = req.body;
        var sanMId = sanitizeHtml(post.main_id);
        var sanSId = sanitizeHtml(post.sub_id);
        var sanMname = sanitizeHtml(post.main_name);
        var sanSname = sanitizeHtml(post.sub_name);
        var sanEnd = sanitizeHtml(post.end);

        db.query(`update code set main_id= ?, sub_id = ?, main_name = ?, sub_name = ? , end=? where main_id = ?;`,
            [sanMId, sanSId, sanMname, sanSname, sanEnd,sanMId], (err, result)=>{
            if(err){
                throw err;
            }
            res.redirect('/code/view');
            res.end();
        }); // 첫번째 쿼리
    },

    delete_process: (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var main_id = req.params.main;

        db.query(`delete from code where main_id = ?;`,[main_id], (err,result)=>{
            if(err){
                throw err;
            }
            res.redirect('/code/view');
            res.end();
        }); // 첫번쨰 쿼리
    }
}
