const express = require('express');
const router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const g_var = require('../modules/varible');
const imageDownloader = require('node-image-downloader');
const {getAllCasts} = require('../controller/CastsController');

router.get('/', getAllCasts);



router.get('/addnew', function(req, res, next) {
    res.send('Form thêm diễn viên');
});
router.post('/store', function(req, res, next) {
    //nhận dữ liệu từ addnew để thêm record vào db
});
router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    res.send('Form chỉnh sửa thông tin diễn viên' + id);
});
router.post('/update', function(req, res, next) {
    //nhận dữ liệu từ edit để cập nhật vào db
});
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    res.send('Xóa diễn viên');
});

module.exports = router;
