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
    return {name, login, cls}
}


module.exports = {
    view: (req,res)=>{ // code.ejs

    },

    create: (req,res)=>{ // codeCU.ejs

    },

    create_process:(req,res)=>{

    },

    update : (req,res)=>{ // codeCU.ejs

    },

    update_process:(req,res)=>{

    },

    delete_process: (req,res)=>{

    }
}
