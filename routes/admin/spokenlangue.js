var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const spokenRes = require('../../controller/SpokenlangueController');

router.get('/', function (req, res, next) {
    res.render('admin/spokenlangue/index', {title: 'spokenlangue list'});
});

router.post('/list', function (req, res, next) {
    var list = spokenRes.getList().then(list =>{
        res.status(200).send(list);
    });


});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await spokenRes.getById(id);
        res.status(200).send(item);

    } catch (e) {
        console.log('Spoken get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        iso_639_1: body.iso_639_1,
        name: body.name
    };
    let insert = await spokenRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await spokenRes.update(id, {
        iso_639_1: body.iso_639_1,
        name: body.name
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body.id;
    try {
        let remove = await spokenRes.delete(id);
        var response = {
            status: false,
            msg: 'delete success'
        };
        res.status(200).send(response)
    }catch (e) {
        res.status(400).send("err");

    }

});
module.exports = router;
