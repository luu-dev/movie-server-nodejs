var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const movieRes = require('../../controller/MoviesController');
const genresRes = require('../../controller/GenreController');
const castRes = require('../../controller/CastsController');
const videoRes = require('../../controller/VideoController');
const countryRes = require('../../controller/CountryController');
const companyRes = require('../../controller/CompanyController');
const spokenRes = require('../../controller/SpokenLangueController');
const multer = require('multer');
const _path_img_upload = './public/images/';
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        let file_name = Date.now() + "_" + file.originalname;
        cb(null, file_name)
    }
});

var upload = multer({storage: storage});
router.get('/', function (req, res, next) {
    res.render('admin/moviee/index', {title: 'movie list'});
});

router.post('/list', async function (req, res, next) {
    var listMovie = await movieRes.getList();
    res.status(200).send(listMovie)

});


router.get('/detail/:id', async function (req, res, next) {
    console.log(req.params.id);

    var movie = await movieRes.getById(req.params.id);
    var listGenres = await genresRes.getList();
    var listCast = await castRes.getList();
    var listVideo = await videoRes.getList();
    var listCountry = await countryRes.getList();
    var listCompany = await companyRes.getList();
    var listSpoken = await spokenRes.getList();
    var list = {};
    list.movie = movie;
    list.videos = listVideo;
    list.countrys = listCountry;
    list.spokens = listSpoken;
    list.genres = listGenres;
    list.casts = listCast;
    list.companys = listCompany;

    console.log(list.casts);

    res.render("admin/moviee/create", {list: list, layout: 'admin/layout'});
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    body.production_countries_id = JSON.parse(body.production_countries_id);
    body.genre_ids = JSON.parse(body.genre_ids);
    body.production_companies_id = JSON.parse(body.production_companies_id);
    body.casts_id = JSON.parse(body.casts_id);
    body.videos_id = JSON.parse(body.videos_id);


    console.log(body);
    var data = {
        genre_ids: body.genre_ids,
        original_language: body.original_language,
        original_title: body.original_title,
        overview: body.overview,
        popularity: body.popularity,
        release_date: body.release_date,
        title: body.title,
        vote_average: body.vote_average,
        type: body.type,
        runtime: body.runtime,
        production_countries_id: body.production_countries_id,
        production_companies_id: body.production_companies_id,
        casts_id: body.casts_id,
        videos_id: body.videos_id,
        backdrop_path: body.backdrop_path,
        poster_path: body.poster_path
    };
    let insert = await movieRes.insert(data);
    res.status(200).send("insert");
});
router.post('/uploadmultiple', upload.array('img', 12), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error)
    }
    res.send(files)
});
router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;


    let item = await movieRes.getById(id);

    let old_backdrop = item.backdrop_path;
    let old_poster = item.poster_path;

    console.log(item);

    let data_update = {
        genre_ids: body.genre_ids,
        original_language: body.original_language,
        original_title: body.original_title,
        overview: body.overview,
        popularity: body.popularity,
        release_date: body.release_date,
        title: body.title,
        vote_average: body.vote_average,
        type: body.type,
        spoken_languages_id: body.spoken_languages_id,
        runtime: body.runtime,
        production_countries_id: body.production_countries_id,
        production_companies_id: body.production_companies_id,
        casts_id: body.casts_id,
        videos_id: body.videos_id,
        backdrop_path: body.backdrop_path,
        poster_path: body.poster_path
    };

    let update = await movieRes.update(id,data_update );

    if(old_backdrop || old_poster) {
        await    fs.stat(_path_img_upload + old_backdrop, function (err, stats) {
            if (err) {
                console.error('Remove file error:', err);
            } else {
                  fs.unlink(_path_img_upload + old_backdrop,function(err){
                    if(err) return console.log(err);
                    console.log('Remove file successfully');
                });
            }
        });
        await  fs.stat(_path_img_upload + old_poster, function (err, stats) {
            if (err) {
                console.error('Remove file error:', err);
            } else {
                fs.unlink(_path_img_upload + old_poster,function(err){
                    if(err) return console.log(err);
                    console.log('Remove file successfully');
                });
            }
        });
    }
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body._id;

    let item = await movieRes.getById(id);

    let old_backdrop = item.backdrop_path;
    let old_poster = item.poster_path;
    try {
        let remove = await movieRes.delete(id);
        var response = {
            status: false,
            msg: 'delete success'
        };

        if(old_backdrop || old_poster) {
            await    fs.stat(_path_img_upload + old_backdrop, function (err, stats) {
                if (err) {
                    console.error('Remove file error:', err);
                } else {
                    fs.unlink(_path_img_upload + old_backdrop,function(err){
                        if(err) return console.log(err);
                        console.log('Remove file successfully');
                    });
                }
            });
            await  fs.stat(_path_img_upload + old_poster, function (err, stats) {
                if (err) {
                    console.error('Remove file error:', err);
                } else {
                    fs.unlink(_path_img_upload + old_poster,function(err){
                        if(err) return console.log(err);
                        console.log('Remove file successfully');
                    });
                }
            });
        }
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send("err");

    }

});
module.exports = router;
