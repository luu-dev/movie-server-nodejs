var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const commentRes = require('../../controller/CommentController');
const userRes = require('../../controller/CountryController');
const spokenRes = require('../../controller/SpokenLangueController');

router.get('/', function (req, res, next) {
    res.render('admin/video/index', {title: 'video list'});
});

router.post('/list', async function (req, res, next) {
    let body = req.body,
        movie_id = body.movieId;
    let list = await commentRes.getListbyMovieId(movie_id).then(list =>{
        var results = {};
        let ids = list.user_id;
        var list_user_id = userRes.getListbyId(ids);


        for (let i = 0; i < list.length; i++) {
            var ob  ={};
            ob.comment = lis[i].comment;
            ob.created_at = lis[i].created_at;
            ob._id = lis[i]._id;
            ob.movie_id = lis[i].movie_id;
            ob.user_name = list_user_id[i].name;
            results.add(ob)
        }

        res.status(200).send(results);
    });


});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        comment: body.comment,
        user_id: body.user_id,
        movie_id: body.movie_id,
        created_at: body.created_at,
    };
    let insert = await commentRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        movie_id = body.id;

    let update = await commentRes.update(id, {
        comment: body.comment,
        created_at: body.created_at
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body._id;
    try {
        let remove = await commentRes.delete(id);
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
