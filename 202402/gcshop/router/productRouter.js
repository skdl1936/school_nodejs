const express = require('express');
var router = express.Router();

var product = require('../lib/product');


router.get('/view', (req,res)=>{
    product.view(req,res);
})

router.get('/create', (req,res)=>{
    product.create(req,res);
})

router.post('/create_process',(req,res)=>{
    product.create_process(req,res);
})

router.get("/update/:merId", (req,res)=>{
    product.update(req,res);
})
router.post('/update_process', (req,res)=>{
    product.update_process(req,res);
})

router.get('/delete/:merId', (req,res)=>{{
    product.delete_process();
}})

module.exports = router;