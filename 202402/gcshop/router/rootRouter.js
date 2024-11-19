const express = require('express');
const router = express.Router();

const root = require('../lib/root');

router.get('/', (req,res) =>{
    root.home(req,res);
})

router.get('/category/:categ',(req,res)=>{
    root.categoryview(req,res);
})

router.post('/search',(req,res)=>{
    root.search(req,res);
})

router.get('/detail/:merId', (req,res)=>{
    root.detail(req,res);
})

router.get('/cartView', (req,res)=>{
    root.cartView(req,res);
})

router.get('/cart/update/:cartId',(req,res)=>{
    root.cartUpdate(req,res);
})
router.post('/cart/update_process',(req,res)=>{
    root.cartUpdateProcess(req,res);
})

router.get('/cart/delete/:cartId', (req,res)=>{
    root.cartDeleteProcess(req,res);
});

router.get('/table', (req,res)=>{
    root.table(req,res);
})

router.get('/table/view/:tableName', (req,res)=>{
    root.table_detail(req,res);
})

router.get('/purchaseView',(req,res)=>{
    root.purchaseView(req,res);
})
router.get('/purchaseUpdate/:purchaseId', (req,res)=>{
    root.purchaseUpdate(req,res);
})
router.post('/purchaseUpdateProcess',(req,res)=>{
    root.purchaseUpdateProcess(req,res);
})
router.get('/purchaseDelete/:purchaseId',(req,res)=>{
    root.purchaseDeleteProcess(req,res);
})


module.exports = router;