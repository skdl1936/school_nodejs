var db = require('./db');
var sanitizeHtml = require('sanitize-html');
const {auth} = require("mysql/lib/protocol/Auth");

function authIsOwner(req,res){
    var name = 'Guest';
    var login = false;
    var cls = 'NON'; // 로그인 확인
    if(req.session.is_logined){
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return {name, login, cls}
}

module.exports = {
    view: (req, res)=>{ // product.ejs
        var {name, login, cls} = authIsOwner(req,res);
        var sql1 = `select * from boardtype; `;
        var sql2 = 'select * from product;';

        db.query(sql1 + sql2,(err,results)=>{
            if(err){
                throw err;
            }

            var context = {
                who:name,
                login: login,
                body: 'product.ejs',
                cls:cls,
                boardtypes: results[0],
                products: results[1]
            };

            res.render("mainFrame", context, (err,html)=>{
                res.end(html);
            });
        })
    },

    create: (req, res)=>{ // productCU.ejs
        var {name, login, cls} = authIsOwner(req,res);
        var sql1 = `select * from boardtype;`;
        var sql2 = `select * from code; `;
        db.query(sql1 + sql2 ,(err,results)=>{
            if(err){
                throw err;
            }

            var context = {
                who:name,
                login:login,
                body: 'productCU.ejs',
                cls:cls,
                boardtypes: results[0],
                categorys: results[1],
            }

            req.app.render('mainFram', context, (err,html)=>{
                res.end(html);
            })
        }) // 1.query
    },
    create_process: (req,res) =>{

    },
    update: (req,res)=>{

    },
    update_process: (req,res)=>{

    },
    delete_process: (req,res)=>{

    }

}