var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const reviewRes = require('../../controller/ReviewControllter');
const movieRes = require('../../controller/MoviesController');

router.get('/', function (req, res, next) {
    res.render('admin/review/index', {title: 'video list'});
});

router.post('/listmovie', async function (req, res, next) {
    let list = await movieRes.getList();
    res.status(200).send(list);

});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await reviewRes.getById(id);
        res.status(200).send(item);

    }catch (e) {
        console.log('Review get one:', e.message);
        res.status(400);
    }
});

router.post('/listbymovieid', async function (req, res, next) {
    let body = req.body,
        movie_id = body.movie_id;
    let list = await reviewRes.getListbyMovieId(movie_id).then(list =>{
        res.status(200).send(list);
    });


});
router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        content: body.content,
        movie_id: body.movie_id,
        url: body.url,
    };
    let insert = await reviewRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;
    console.log(body);

    let update = await reviewRes.update(id, {
        content: body.content,
        url: body.url,
        movie_id: body.movie_id
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body._id;
    try {
        let remove = await reviewRes.delete(id);
        var response = {
            status: false,
            msg: 'delete success'
        };
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send("err");

    }

});
module.exports = router;
