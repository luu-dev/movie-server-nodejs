var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../../model");
const company = model.model('production_company');

const companyRes = require('../../controller/CompanyController');

router.get('/', function(req, res, next) {
    res.render('admin/company/index', { title: 'Company list' });
});

router.post('/list', function (req, res, next) {
    try {
        var data = company.find().exec()
            .then(data =>{
                console.log(data);
                res.status(200).send(data);
            });

    }catch (e) {
        console.log('videos trailer err:', e);
        response.msg = "Unknow error!";
        res.status(400);
    }
});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await companyRes.getById(id);
        res.status(200).send(item);

    }catch (e) {
        console.log('Company get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        id:-1,
        name: body.name,
        logo_path: body.logo_path,
        origin_country: body.origin_country

    };
    let insert = await companyRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await companyRes.update(id, {
        name: body.name,
        logo_path: body.logo_path,
        origin_country: body.origin_country
    });
    res.status(200).send(update);
});



router.post('/delete',companyRes.delete);


module.exports = router;
