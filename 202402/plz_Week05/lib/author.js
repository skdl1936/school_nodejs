var db = require('./db')
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html')


module.exports= {
    create: (req,res)=>{
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

                var b = `<form action='/author/create_process' method='post'>
                            <p><input type='text' name='name' placeholder='name'></p>
                            <p><input type='text' name='profile' placeholder='profile'></p>
                            <p><input type='submit' value='저자생성'></p>
                        </form>`;
                
                var context = {
                    title: "AUTHOR 생성화면",
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
        var id = req.params.pageId;
        db.query('select * from topic', (err1, topics)=>{
            if(err1){throw err1}
            db.query('select * from author', (err2, authors)=>{
                if(err2){throw err2}
                db.query('select * from author where id = ?', [id], (err3, author)=>{
                    
                })
            })
        })
    },

    update_process:(req,res)=>{

    },

    delete_process:(req,res)=>{
        var id = req.params.pageId;
        db.query(`delete from author where id = ?`, [id] , (err, result)=>{
            if(err){throw err};
            res.redirect("/author");
            res.end();
        })
    }
}


