const express = require('express');
const router = express.Router();

const code = require('../lib/code');


router.get('/view', (req,res)=>{
    code.view(req,res);
});

router.get('/create', (req,res)=>{
    code.create(req,res);
})

router.post('/create_process', (req,res)=>{
    code.create_process(req,res);
})

router.get('/update/:main/:sub/:start', (req,res)=>{
    code.update(req,res);
})

router.post('/update_process', (req,res)=>{
    code.update_process(req,res);
})

//end는 빼도 상관없음
router.get('/delete/:main/:sub/:start', (req,res)=>{
    code.delete_process(req,res);
})



module.exports = router;