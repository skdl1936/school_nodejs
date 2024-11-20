const db = require('./db');
const {authIsOwner} = require('./util');
const { URL } = require('url');
const sanitizeHtml = require("sanitize-html");
const {purchase} = require("./purchase");
const {auth} = require("mysql/lib/protocol/Auth");

module.exports = {
    home: (req, res) => {
        const {login, name, cls} = authIsOwner(req, res)
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code;`
        const sql3 = ` select * from product;`

        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error){
                throw error;
            }
            const context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who: name,
                login: login,
                body: 'product.ejs',
                cls: cls,
                boardtypes: results[0],
                codes: results[1],
                products:results[2],
                routing: "root"
            };
            res.render('mainFrame', context, (err, html) => {
                if(err)
                    throw err;
                res.end(html)
            }); //render end
        }); //query end
    },

    categoryview: (req,res) =>{
        const {login, cls, name} = authIsOwner(req,res);
        const main_id = req.params.categ.substring(0,4);
        const sub_id = req.params.categ.substring(4,8);

        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code;`
        const sql3 = ` select * from product where main_id = ${main_id} and sub_id = ${sub_id};`;

        db.query(sql1 + sql2 + sql3, (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who: name,
                login: login,
                body: 'product.ejs',
                cls: cls,
                boardtypes: results[0],
                codes: results[1],
                products:results[2],
                routing: "root"
            };

            res.render('mainFrame', context, (err, html) => {
                res.end(html)
            }); //render end
        });


    },

    search: (req,res)=>{
        const {login, cls, name} = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code;`
        const sql3 = ` select * from product
                            where name like '%${req.body.search}%' or
                            brand like '%${req.body.search}%' or
                            supplier like '%${req.body.search}%';`;

        db.query(sql1 + sql2 + sql3, (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who: name,
                login: login,
                body: 'product.ejs',
                cls: cls,
                boardtypes: results[0],
                codes: results[1],
                products:results[2],
                routing: "root"
            };

            res.render('mainFrame', context, (err, html) => {
                res.end(html)
            }); //render end
        });
    },

    detail :(req,res)=>{
        const {name, login, cls} = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code;`
        const sql3 = ` select * from product where mer_id = ${req.params.merId};`
        const sql4 = ` select * from cart where loginid = ? and mer_id = ?; `
        var check = false;

        db.query(sql1 + sql2 + sql3 + sql4 ,[req.session.loginid, req.params.merId], (error, results) => {
            if(error){
                throw error;
            }
            if (results[3] && results[3].length > 0) {
                check = true;
            }
            const context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who: name,
                login: login,
                body: 'productDetail.ejs',
                cls: cls,
                boardtypes: results[0],
                codes: results[1],
                product:results[2][0],
                routing: "root",
                check: check
            };

            res.render('mainFrame', context, (err, html) => {
                if(err)
                    throw err;
                res.end(html)
            }); //render end
        });
    },
    cartView: (req,res)=>{
        const {name, login, cls} = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `
        const sql3 = ` 
        SELECT
            c.cart_id as cartId,
            c.loginid as loginid,
            c.mer_id as mer_id,
            c.date as date,
            p.name AS productName,
            pr.name AS personName
        FROM
            cart c
        JOIN
            product p ON c.mer_id = p.mer_id
        JOIN
            person pr ON c.loginid = pr.loginid;`

        db.query(sql1 + sql2 + sql3, (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who: name,
                login: login,
                body: 'cartView.ejs',
                cls: cls,
                boardtypes: results[0],
                codes: results[1],
                carts: results[2]
            };

            res.render('mainFrame', context, (err, html) => {
                if(err)
                    throw err;
                res.end(html)
            });


        })
    },
    cartUpdate:(req,res)=>{
        const {name, login, cls} = authIsOwner(req,res);
        const cartId = req.params.cartId;
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `
        const sql3 = ` select * from person; `;
        const sql4 = ` select * from product; `;
        const sql5 = ` 
        SELECT
            c.loginid AS loginid,
            c.cart_id as cart_id,
            c.mer_id AS mer_id,
            c.date AS date,
            p.name AS productName,
            pr.name AS personName,
            pr.loginid as loginid
        FROM
            cart c
        JOIN
            product p ON c.mer_id = p.mer_id
        JOIN
            person pr ON c.loginid = pr.loginid
        where
            c.cart_id = ${cartId}; `

        db.query(sql1 + sql2 + sql3 + sql4 + sql5 , (err, results) => {
            if(err){
                throw err;
            }

            const context = {
                who: name,
                login: login,
                cls:cls,
                body: 'cartU.ejs',
                boardtypes: results[0],
                codes: results[1],
                persons:results[2],
                products: results[3],
                cart: results[4][0],
            }
            req.app.render('mainFrame', context, (err, html) => {
                if(err)
                    throw err;
                res.end(html);
            })
        })

    },
    cartUpdateProcess:(req,res)=>{
        const post = req.body;
        db.query(`update cart set loginid = '${post.personName}', mer_id = ${post.productsName} where cart_id =${post.cart_id}`,(err, results) => {
            if(err){
                throw err;
            }
            res.redirect('/cartView');
            res.end();
        })
    },

    cartDeleteProcess: (req,res)=>{
        db.query(`delete from cart where cart_id = ?`,[req.params.cartId],(err,results)=>{
            if(err){
                throw err;
            }

            res.redirect('/cartView');
            res.end();
        })
    },

    table: (req,res)=>{
        const {name, login, cls } = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `;
        const sql3 = `select * from Information_schema.tables where table_schema = 'webdb2024';`
        db.query(sql1 + sql2 + sql3, (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who:name,
                login: login,
                cls: cls,
                body: 'tableManage.ejs',
                boardtypes: results[0],
                codes: results[1],
                tables: results[2]
            }

            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            })
        })
    },
    table_detail: (req,res)=>{
        const {name, login, cls } = authIsOwner(req,res);
        const tableName = req.params.tableName;

        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `;
        const sql3 = `  SELECT * 
            FROM information_schema.columns 
            WHERE table_schema = 'webdb2024' 
            AND table_name = ?; `;
        const sql4 = ` select * from ??`;

        db.query(sql1 + sql2 + sql3 + sql4,[tableName, tableName], (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who:name,
                login: login,
                cls: cls,
                body: 'tableView.ejs',
                boardtypes: results[0],
                codes: results[1],
                columns: results[2],
                values: results[3]
            }
            req.app.render('mainFrame', context, (err, html) => {
                res.end(html);
            })

        })
    },
    purchaseView: (req,res)=>{
        const {name, login, cls } = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `;
        const sql3 = ` 
        SELECT 
            purchase.*,            
            product.name as product_name,  
            person.name as person_name     
        FROM 
            purchase
        JOIN 
            product ON purchase.mer_id = product.mer_id    
        JOIN 
            person ON purchase.loginid = person.loginid;`;

        db.query(sql1 + sql2 + sql3 , (err, results) => {
            if(err){
                throw err;
            }

            const context = {
                who:name,
                login: login,
                cls: cls,
                body: 'purchaseView.ejs',
                boardtypes: results[0],
                codes: results[1],
                purchases: results[2]
            }

            req.app.render('mainFrame', context, (err, html) => {
                if (err){
                    throw err;
                }
                res.end(html);
            })
        })
    },
    purchaseUpdate:(req,res)=>{
        const {name, login, cls } = authIsOwner(req,res);
        const purchaseId = req.params.purchaseId;
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `;
        const sql3 = ` select * from person; `;
        const sql4 = ` select * from product; `;
        const sql5 = ` 
        SELECT 
            purchase.*,            
            product.name as product_name,  
            person.name as person_name     
        FROM 
            purchase
        JOIN 
            product ON purchase.mer_id = product.mer_id    
        JOIN 
            person ON purchase.loginid = person.loginid
        where
            purchase.purchase_id = ${purchaseId};`;

        db.query(sql1+ sql2 + sql3 + sql4 + sql5, (err, results) => {
            if(err){
                throw err;
            }
            const context = {
                who:name,
                login: login,
                cls:cls,
                body: 'purchaseU.ejs',
                boardtypes: results[0],
                codes:results[1],
                persons:results[2],
                products:results[3],
                purchase:results[4][0]
            }

            req.app.render('mainFrame', context, (err, html) => {
                if (err){
                    throw err;
                }
                res.end(html);
            })
        })
    },
    purchaseUpdateProcess:(req,res)=>{
        const post = req.body;
        const purchase_id = post.purchase_id;
        const sanPrice = sanitizeHtml(post.price);
        const sanPoint = sanitizeHtml(post.point);
        const sanQty = sanitizeHtml(post.qty);
        const sanTotal = sanitizeHtml(post.total);

        db.query(`update purchase set 
            loginid = ?, mer_id = ?, price = ?, point = ?, qty=?, total = ?, payYN = ?, cancel= ?, refund=? 
            where purchase_id = ?;`,
            [post.cts, post.product, sanPrice, sanPoint,sanQty,sanTotal, post.payYN, post.cancel, post.refund, purchase_id ],(err,results)=>{
                if(err){
                    throw err;
                }
                res.redirect('/purchaseView');
                res.end();
            });
    },
    purchaseDeleteProcess:(req,res)=>{
        const purchaseId = req.params.purchaseId;
        db.query(`delete from purchase where purchase_id = ${purchaseId}`,(err, results) => {
            if(err){
                throw err;
            }
            res.redirect('/purchaseView')
            res.end();
        })
    },
    customer:(req,res)=>{
        const {name,login, cls} = authIsOwner(req,res);
        const sql1 = 'select * from boardtype;';
        const sql2 = ` select * from code; `;
        const sql3 = ` select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
from person group by address; `;

        db.query(sql1 + sql2 + sql3 , (err,results)=>{
            if (err){
                throw err;
            }
            const context = {
                who:name,
                login: login,
                cls:cls,
                body: 'ceoAnal.ejs',
                boardtypes: results[0],
                codes:results[1],
                percentage: results[2]
            }

            req.app.render('mainFrame', context, (err, html) => {
                if (err){
                    throw err;
                }
                res.end(html);
            })
        })

    }
}