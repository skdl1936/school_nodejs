const express = require('express');
const multer = require('multer'); // 파일을 업로드 해주기 위한 미들웨어
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({ // storage: 업로드할 파일을 어디다 저장할건가
        filename(req,file,cb){ // 파일 저장될 이름
            cb(null,file.originalname);
        },
        destination(req,file,cb){ // 파일 저장될 경로
            cb(null, path.resolve(__dirname, "../public/image/"));
        },
    }),
});

const router = express.Router();
const product = require('../lib/product');


router.get('/view', (req,res)=>{
    product.view(req,res);
})

router.get('/create', (req,res)=>{
    product.create(req,res);
})

router.post('/create_process', upload.single('uploadFile'),(req,res)=>{
    product.create_process(req,res);
})

router.get("/update/:merId", (req,res)=>{
    product.update(req,res);
})
router.post('/update_process', upload.single('uploadFile'), (req,res)=>{
    product.update_process(req,res);
})

router.get('/delete/:merId', (req,res)=>{{
    product.delete_process(req,res);
}})

module.exports = router;