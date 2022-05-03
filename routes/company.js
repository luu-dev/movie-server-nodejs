var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../model");
const company = model.model('production_company');
const g_var = require('../modules/varible');
const imageDownloader = require('node-image-downloader');


router.get('/', function (req, res, next) {
    try {
        var data = company.find().exec()
            .then(data =>{
                console.log(data);

                res.render("movie/company",{'mydata' : data});

            });

    }catch (e) {
        console.log('videos trailer err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});


module.exports = router;
