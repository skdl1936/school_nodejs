const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const {authIsOwner} = require('./util');



module.exports = {
    purchasedetail: (req,res,next) => {
        const {name, login, cls} = authIsOwner(req);
        const sql1 = `select * from boardtype; `;
        const sql2 = ` select * from code; `;
        const sql3 = ` select * from product where mer_id = ${req.params.merId};`;
        const sql4 = ` select * from cart where loginid = ? and mer_id = ?; `
        var check = false;
        db.query(sql1 + sql2 + sql3 + sql4 ,[req.session.loginid, req.params.merId], (err,results)=>{
            if(err)
                throw err;

            if (results[3] && results[3].length > 0) {
                check = true;
            }

            const context = {
                who:name,
                login: login,
                cls: cls,
                body: 'purchaseDetail.ejs',
                boardtypes: results[0],
                codes: results[1],
                product: results[2][0],
                loginId: req.session.loginid,
                check: check
            }

            req.app.render('mainFrame', context, (err,html)=>{
                // if(err)
                //     throw err;
                res.end(html);
            })
        })
    },
    create_process:(req,res)=>{
        const post = req.body;
        const sanQty = parseInt(sanitizeHtml(post.qty));
        const price = parseInt(post.price);
        const total = price * sanQty;

        db.query(`insert into purchase(loginid, mer_id, date, price, point,qty, total, payYN, cancel, refund)
                values(?,?,now(),?,?,?,?,?,?,?); `, [post.loginid,post.mer_id,post.price,0,sanQty,total,'N','N','N'], (err,results)=>{
                if(err)
                    throw err;
                res.redirect('/purchase');
                res.end();
            }
        )
    },

    purchase: (req,res,next) => {
        const {name, login, cls} = authIsOwner(req);
        const loginId = req.session.loginid;
        const sql1 = `select * from boardtype; `;
        const sql2 = ` select * from code; `;
        const sql3 = `
        select 
            pr.name as name,
            pr.image as image,
            p.purchase_id as purchase_id,
            p.price as price,
            p.qty as qty,
            p.total as total,
            p.date as date,
            p.cancel as cancel,
            p.mer_id as mer_id
        from 
            purchase p 
        join 
            product pr ON p.mer_id = pr.mer_id
        where 
            p.loginid = ?;`;

        db.query(sql1 + sql2 + sql3,[loginId] , (err,results)=>{
            if(err){
                throw err;
            }
            const context={
                who:name,
                login: login,
                cls: cls,
                body: "purchase.ejs",
                boardtypes: results[0],
                codes: results[1],
                purchases: results[2],
            }

            req.app.render('mainFrame', context, (err, html)=>{
                res.end(html);
            })
        })
    },

    cancel_process:(req,res)=>{
        db.query(`update purchase set cancel = 'Y' where purchase_id = ${req.params.purchaseId}`, (err,results)=>{
            if (err)
                throw err;

            res.redirect('/purchase/');
            res.end();
        })
    },

    cart_process:(req,res)=>{
        const loginId = req.session.loginid;
        db.query(`insert into cart(loginid, mer_id, date) values(?,?,now())`,[loginId, req.body.mer_id],(err,results)=>{
            if(err)
                throw err;

            res.redirect('/purchase/cart');
            res.end();
        })
    },

    cart:(req,res)=>{
        const {name, login, cls} = authIsOwner(req);
        const loginId = req.session.loginid;
        const sql1 = `select * from boardtype; `;
        const sql2 = ` select * from code; `;
        const sql3 = ` 
        SELECT 
            c.date as date,
            c.mer_id as mer_id,
            c.cart_id as cart_id,
            pr.image as image,
            pr.name as name,
            pr.price as price
        FROM 
            cart c
        JOIN 
            product pr ON c.mer_id = pr.mer_id
        WHERE 
            c.loginid = ?;
        `
        db.query(sql1 + sql2 + sql3 ,[loginId],(err,results)=>{
            if(err)
                throw err;

            const context = {
                who:name,
                login: login,
                cls: cls,
                body: "cart.ejs",
                boardtypes: results[0],
                codes: results[1],
                carts: results[2]
            }

            req.app.render('mainFrame',context, (err,html)=>{
                if (err)
                    throw err;
                res.end(html);
            })
        })
    },

    delete_process: (req,res)=>{
        const checkItem = req.body.checkProduct;

        db.query(`delete from cart where cart_id in (?)`, [checkItem], (err,results)=>{
            if(err)
                throw err;

            res.redirect('/purchase/cart');
        })
    },

    buy_process:(req,res)=>{
        const post = req.body;
        const checkItem = Array.isArray(req.body.checkProduct) ? req.body.checkProduct : [req.body.checkProduct];
        const loginid = req.session.loginid;
        let price = 0;
        let qty = 0;
        let total = 0;

        const sql1 = `delete from cart where cart_id in (?);`;
        let sql2 = `insert into purchase (loginid, mer_id, date, price, qty, total, payYN, cancel, refund) values `;

        let values = [];
        if(checkItem.length === 1){
            price = parseInt(post.price);
            qty = parseInt(post.qty);
            total = price * qty;
            values.push(`('${loginid}', ${post.mer_id}, NOW(), ${price}, ${qty}, ${total}, 'N', 'N', 'N');`);
        }else{
            for (let i = 0; i < checkItem.length; i++) {
                price = parseInt(post.price[i]);
                console.log(price);
                qty = parseInt(post.qty[i]);
                total = price * qty;

                values.push(`('${loginid}', ${post.mer_id[i]}, NOW(), ${price}, ${qty}, ${total}, 'N', 'N', 'N')`);
            }
        }

        sql2 += values.join(", ") + ";";

        db.query(sql1, [checkItem], (err, result1) => {
            if (err) {
                throw err;
            }

            // 두 번째 쿼리 실행: 구매 내역에 추가
            db.query(sql2 , (err, result2) => {
                if (err) {
                    throw err;
                }

                res.redirect('/purchase');
                res.end();
            });
        });

    }







}