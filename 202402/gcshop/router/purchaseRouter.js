const express = require('express');
const router = express.Router();
const purchase = require('../lib/purchase');


router.get('/detail/:merId', (req, res) => {
    purchase.purchasedetail(req,res);
})

router.post('/create_process', (req,res)=>{
    purchase.create_process(req,res);
})

router.get('/', (req, res) => {
    purchase.purchase(req,res);
})

router.get('/cancel/:purchaseId', (req, res) => {
    purchase.cancel_process(req,res);
})

router.post('/cart_process', (req,res)=>{
    purchase.cart_process(req,res);
})

router.get('/cart', (req,res)=>{
    purchase.cart(req,res);
})

router.post('/cart/delete', (req,res)=>{
    purchase.delete_process(req,res);
})

router.post('/cart/buy', (req,res)=>{
    purchase.buy_process(req,res);
})

module.exports = router;