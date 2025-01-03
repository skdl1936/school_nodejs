const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const {authIsOwner} = require('./util');

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
        const sql1 = `select * from boardtype; `
        const sql2 = ` select * from code; `
        db.query(sql1 + sql2, (err,results)=>{
            var context = {
                who: name,
                login : login,
                body : 'codeCU.ejs',
                cls : cls,
                check: true, // 입력인지 수정인지 확인
                boardtypes: results[0],
                codes: results[1]
            };

            req.app.render('mainFrame', context, (err,html)=>{
                res.end(html);
            })
        })

    },

    create_process:(req,res)=>{
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
        const {name, login, cls} = authIsOwner(req,res);
        const start = req.params.start;
        const main_id = req.params.main;
        const sub_id = req.params.sub;
        const sql1 = 'select * from boardtype; ';
        const sql2 = ` select * from code; `
        const sql3 =  ` select * from code where main_id = ${main_id} and sub_id = ${sub_id} and start = ${start};`;
        db.query(sql1 + sql2 + sql3, (err,results)=>{
                var context = {
                    who: name,
                    login : login,
                    body : 'codeCU.ejs',
                    cls : cls,
                    check: false, // 생성(true)인지 수정(false)인지 확인
                    boardtypes: results[0],
                    codes: results[1],
                    code: results[2],
                };

                req.app.render('mainFrame', context, (err,html)=>{
                    res.end(html);
                })
        })

    },

    update_process:(req,res)=>{
        const post = req.body;
        const sanMId = sanitizeHtml(post.main_id);
        const sanSId = sanitizeHtml(post.sub_id);
        const sanMname = sanitizeHtml(post.main_name);
        const sanSname = sanitizeHtml(post.sub_name);
        const sanStart = sanitizeHtml(post.startValue);
        const sanEnd = sanitizeHtml(post.end);


        db.query(`update code set main_id= ?, sub_id = ?, main_name = ?, sub_name = ? , end= ? 
                where main_id = ? and sub_id = ? and start = ? ;`,
            [sanMId, sanSId, sanMname, sanSname, sanEnd,sanMId,sanSId,sanStart], (err, result)=>{
            if(err){
                throw err;
            }
            res.redirect('/code/view');
            res.end();
        }); // 첫번째 쿼리
    },

    delete_process: (req,res)=>{
        const main_id = req.params.main;
        const sub_id = req.params.sub;
        const start = req.params.start;
        db.query(`delete from code where main_id = ? and sub_id = ? and start = ?;`,[main_id,sub_id,start], (err,result)=>{
            if(err){
                throw err;
            }
            res.redirect('/code/view');
            res.end();
        }); // 첫번쨰 쿼리
    }
}
