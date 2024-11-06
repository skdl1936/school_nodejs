const db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req,res){
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if(req.session.is_logined){
        name = req.session.name;
        login = true;
        cls = req.session.cls ;
    }
    return {name,login,cls}
}
module.exports = {
    home: (req, res) => {
        var {login, name, cls} = authIsOwner(req, res)
        var sql1 = 'select * from boardtype;';
        var sql2 = ` select * from product;`
        db.query(sql1, (error, results) => {
            if(error){
                throw error;
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who: name,
                login: login,
                body: 'test.ejs',
                cls: cls,
                boardtypes: results
            };
            console.log(results);
            res.render('mainFrame', context, (err, html) => {
                res.end(html)
            }); //render end
        }); //query end
    },
}