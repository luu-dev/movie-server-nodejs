var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const countryRes = require('../../controller/CountryController');

router.get('/', function (req, res, next) {
    res.render('admin/country/index', {title: 'Country list'});
});

router.post('/list', function (req, res, next) {
   var list = countryRes.getList().then(list =>{
       res.status(200).send(list);
   });


});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await countryRes.getById(id);
        res.status(200).send(item);

    } catch (e) {
        console.log('Country get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        iso_3166_1: body.iso_3166_1,
        name: body.name
    };
    let insert = await countryRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await countryRes.update(id, {
        iso_3166_1: body.iso_3166_1,
        name: body.name
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body.id;
    try {
        let remove = await countryRes.delete(id);
        res.status(200).send("delete sucess");
    }catch (e) {
        res.status(400).send("err");

    }

});
module.exports = router;
