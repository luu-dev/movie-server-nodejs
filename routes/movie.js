var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../model");
const movie = model.model('movie');
const country = model.model('production_country');
const company = model.model('production_company');
const spoken = model.model('spokenlangue');
const cast = model.model('cast');
const video = model.model('video');
const genre = model.model('genre');
const g_var = require('../modules/varible');
const commentRes = require('../controller/CommentController');
const reviewRes = require('../controller/ReviewControllter');
const imageDownloader = require('node-image-downloader');
const common = require('./common');
var _g_var = {
    page_limit: 10,
};


router.get('/', function (req, res) {

    res.render("movie");

});


router.get('/search', function (req, res, next) {
    var response = {
        status: false,
    };
    if (!common.validKey(req.query)) {
        response.msg = "Unauthorized";
        res.status(401).send(response);
        return false;
    }
    try {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let query = req.query.query;
        let page = parseInt(req.query.page) || 1;
        console.log(query);

        movie.find({'original_title': {$regex: query, $options: 'i'}})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, data) => {
                movie.countDocuments({title: {$regex: query, $options: 'i'}}, (err, count) => { // đếm để tính có bao nhiêu trang
                    if (err) return next(err);
                    let result = {};
                    result.page = page;
                    result.results = data;
                    if (count % perPage === 0) {
                        result.total_pages = count / perPage
                    } else {
                        result.total_pages = parseInt(count / perPage) + 1
                    }
                    res.status(200).send(result);// Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                    console.log(result)
                });
            });


    } catch (e) {
        console.log('catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }


});

router.get('/now_playing', function (req, res, next) {
    var response = {
        status: false,
    };
    if (!common.validKey(req.query)) {
        response.msg = "Unauthorized";
        res.status(401).send(response);
        return false;
    }
    try {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = parseInt(req.query.page) || 1;

        movie.find({type: g_var.type.now_playing})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, data) => {
                movie.countDocuments({type: 2}, (err, count) => { // đếm để tính có bao nhiêu trang
                    if (err) return next(err);
                    let result = {};
                    result.page = page;
                    result.results = data;
                    if (count % perPage === 0) {
                        result.total_pages = count / perPage
                    } else {
                        result.total_pages = parseInt(count / perPage) + 1
                    }
                    console.log(result.page);
                    res.status(200).send(result);
                });
            });


    } catch (e) {
        console.log('Now-playing catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});

router.get('/popular', function (req, res, next) {
    var response = {
        status: false,
    };
    if (!common.validKey(req.query)) {
        response.msg = "Unauthorized";
        res.status(401).send(response);
        return false;
    }
    try {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = parseInt(req.query.page) || 1;

        movie.find({type: g_var.type.popular})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, data) => {
                movie.countDocuments({type: g_var.type.popular}, (err, count) => { // đếm để tính có bao nhiêu trang
                    if (err) return next(err);
                    if (data != null) {
                        console.log(count);
                        let result = {};
                        result.page = page;
                        result.results = data;
                        if (count % perPage === 0) {
                            result.total_pages = count / perPage
                        } else {
                            result.total_pages = parseInt(count / perPage) + 1
                        }
                        //result.total_pages=count;
                        console.log(result.total_pages);

                        res.status(200).send(result);
                    } else
                        res.status(200).send("");
                });
            });


    } catch (e) {
        console.log('popular catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});

router.get('/upcoming', function (req, res, next) {
    var response = {
        status: false,
    };
    if (!common.validKey(req.query)) {
        response.msg = "Unauthorized";
        res.status(401).send(response);
        return false;
    }
    try {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = parseInt(req.query.page) || 1;

        movie.find({type: g_var.type.up_coming})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, data) => {
                movie.countDocuments({type: g_var.type.up_coming}, (err, count) => { // đếm để tính có bao nhiêu trang
                    if (err) return next(err);
                    if (data != null) {
                        console.log(count);

                        let result = {};
                        result.page = page;
                        result.results = data;
                        if (count % perPage === 0) {
                            result.total_pages = count / perPage
                        } else {
                            result.total_pages = parseInt(count / perPage) + 1
                        }
                        res.status(200).send(result);
                    }
                });
            });


    } catch (e) {
        console.log('upcoming catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});


router.get('/:movie_id/similar', async function (req, res, next) {
    var response = {
        status: false,
    };

    var idd = req.params.movie_id
    try {
        let page = parseInt(req.query.page) || 1;
        console.log('page: ', page);

        // detail.production_companies = await company.find({ id: { $in: production_companies_id } }, { id: 1, logo_path: 1,name:1,original_country:1 ,_id: 0 });
        let origin_movie = await movie.findOne({_id: idd}, {genre_ids: 1});

        if (origin_movie) {
            let origin_genre = origin_movie.genre_ids;
            console.log('origin_genre: ', origin_genre);

            if (origin_genre.length > 1) {
                //split genres with 2 elements/pair
                let genre_split_array = common.createGenreFilter(origin_genre);
                let genre_split_filter = [];

                //create filter follow the mongodb format
                for (let i = 0; i < genre_split_array.length; i++) {
                    genre_split_filter.push({genre_ids: {$all: genre_split_array[i]}},);
                }
                console.log(genre_split_filter);

                movie.find({
                    _id: {$nin: idd},
                    $or: genre_split_filter
                })
                    .sort({_id: -1})
                    .skip(_g_var.page_limit * (page - 1))
                    .limit(_g_var.page_limit)
                    .exec((err, data) => {
                        console.log('data:', data);
                        movie.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
                            if (err) return next(err);
                            let result = {};
                            result.page = page;
                            result.results = data;
                            if (count % _g_var.page_limit === 0) {
                                result.total_pages = count / _g_var.page_limit
                            } else {
                                result.total_pages = parseInt(count / _g_var.page_limit) + 1
                            }
                            res.status(200).send(result);// Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                            console.log(data)
                        });
                    });

            } else {
                response.msg = "Genre list is not accept: " + JSON.stringify(origin_genre);
                res.status(400).send(response);
            }

        } else {
            response.msg = "Movie " + idd + " is not found!";
            res.status(400).send(response);
        }

    } catch (e) {
        console.log('Similar catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});

router.post('/insertmovie', (req, res) => {
    var response = {
        status: false,
        msg: ''
    };
    try {
        if (req.body.movie_data != undefined) {
            var movie_data = req.body.movie_data;
            //delete movie_data.production_countries;
            var production_countries = movie_data.production_countries;
            var production_companies = movie_data.production_companies;
            var spoken_languages = movie_data.spoken_languages;
            var casts = movie_data.cast;
            var videos = movie_data.videos;
            var id_cast = [];

            for (var i in casts) {
                id_cast[i] = casts[i].id;
                cast.findOneAndUpdate(
                    {id: id_cast[i]},
                    casts[i],
                    {upsert: true},
                    (error, a) => {
                        if (error) console.log(error);
                        else {
                            var s = a.profile_path;

                            if (s != null) {
                                var profile_path = s.substring(1, s2.length - 4);

                                imageDownloader({
                                    imgs: [
                                        {
                                            uri: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + s,
                                            filename: profile_path
                                        }
                                    ],
                                    dest: './public/images', //destination folder
                                })
                                    .then((info) => {
                                        console.log('dow cast images success', info)
                                    })
                                    .catch((error, response, body) => {
                                        console.log('something goes bad!');
                                        console.log(error)
                                    });

                            }


                            console.log('done');
                        }
                    });


            }

            var id_video = [];
            for (var i in videos) {
                id_video[i] = videos[i].id;
                video.findOneAndUpdate(
                    {id: id_video[i]},
                    videos[i],
                    {upsert: true},
                    (error, a) => {
                        if (error) console.log('video error: ', error);
                        else {
                            console.log('video done');
                        }
                    })
            }
            var id_spoken_languages = [];
            for (var i in spoken_languages) {
                id_spoken_languages[i] = spoken_languages[i].iso_639_1;
                spoken.findOneAndUpdate(
                    {iso_639_1: id_spoken_languages[i]},
                    spoken_languages[i],
                    {upsert: true},
                    (error, ab) => {
                        if (error) console.log('spoken_language error: ', error);
                        else {
                            console.log('spoken_language done');
                        }
                    })
            }


            var id_production_countries = [];
            for (var i in production_countries) {
                id_production_countries[i] = production_countries[i].iso_3166_1;


                country.findOneAndUpdate(
                    {iso_3166_1: id_production_countries[i]},
                    production_countries[i],
                    {upsert: true},
                    (error, a) => {
                        if (error) console.log(error);
                        else {
                            console.log('done');
                        }
                    })

            }

            var id_production_companies = [];
            for (var i in production_companies) {
                id_production_companies[i] = production_companies[i].id;


                company.findOneAndUpdate({id: id_production_companies[i]}, production_companies[i], {upsert: true}, (error, updateRecord) => {
                    if (error) console.log(error);
                    else {
                    }
                })
            }

            delete movie_data.production_countries;
            delete movie_data.production_companies;
            delete movie_data.cast;
            delete movie_data.videos;
            delete movie_data.spoken_languages;

            movie_data.casts_id = id_cast;
            movie_data.videos_id = id_video;
            movie_data.production_countries_id = id_production_countries;
            movie_data.production_companies_id = id_production_companies;
            movie_data.spoken_languages_id = id_spoken_languages;

            movie.findOne({id: movie_data.id}, function (err, result) {
                if (result) {
                    res.status(400).send('Data valid');
                } else {
                    movie.create(movie_data);
                    res.status(200).send("succes");
                }
            });

            var s1 = movie_data.backdrop_path;
            var s2 = movie_data.poster_path;
            if (s1 == null) {
                s1 = s2;
            } else if (s2 == null) {
                s2 = s1;
            }
            if (s1 != null && s2 != null) {
                var backdrop_path = s1.substring(1, s1.length - 4);
                var poster_path = s2.substring(1, s2.length - 4);
                imageDownloader({
                    imgs: [
                        {
                            uri: 'https://image.tmdb.org/t/p/w500' + s1,
                            filename: backdrop_path
                        },
                        {
                            uri: 'https://image.tmdb.org/t/p/w500' + s2,
                            filename: poster_path
                        }
                    ],
                    dest: './public/images', //destination folder
                })
                    .then((info) => {
                        console.log('all imgs done', info)
                    })
                    .catch((error, response, body) => {
                        console.log('something goes bad!');
                        console.log(error)
                    });
            }


        } else {
            response.msg = "Data error!";
            res.status(400).send(response);
        }

    } catch (e) {
        console.log('catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }
});

router.put('/:id', (req, res) => {
    var idd = parseInt(req.params.id);
    movie.updateOne({id: idd}, req.body).then((kq) => {
        res.status(201).send(kq);
    }).catch((error) => {
        res.status(400).send(error);

    })
});

router.get('/:movie_id/credits', (req, res) => {
    try {
        var idd = req.params.movie_id
        var casts = {};
        movie.findOne({_id: idd}, async function (err, result) {
            if (err) console.log(' err:', err);
            let casts_id = result.casts_id;
            casts.id = idd;
            casts.cast = await cast.find({_id: {$in: casts_id}}, {
                _id: 1,
                character: 1,
                gender: 1,
                name: 1,
                profile_path: 1
            });
            res.status(200).send(casts);
        });
    } catch (e) {
        console.log('cast catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});

router.get('/:movie_id/detail', (req, res) => {
    var response = {
        status: false,
    };
    try {
        var idd = req.params.movie_id
        var detail = {};
        var genres = [];
        movie.findOne({_id: idd}, async function (err, result) {
            if (err) console.log(' err:', err);
            console.log(result)
            let genre_ids = result.genre_ids;
            let production_countries_id = result.production_countries_id;
            let production_companies_id = result.production_companies_id;
            let spoken_languages_id = result.spoken_languages_id;

            detail.original_language = '';
            detail.imdb_id = '';
            detail.video = result.video;
            detail.title = result.title;
            detail.backdrop_path = result.backdrop_path;
            detail.revenue = -1;
            detail.genres = await genre.find({_id: {$in: genre_ids}}, {_id: 1, name: 1});
            detail.popularity = result.popularity;
            detail.production_countries = await country.find({iso_3166_1: {$in: production_countries_id}}, {
                iso_3166_1: 1,
                name: 1,
                _id: 0
            });
            detail.id = result.id;
            detail.vote_count = result.vote_count;
            detail.budget = 0;
            detail.overview = result.overview;
            detail.original_title = result.original_title;
            detail.runtime = result.runtime;
            detail.poster_path = result.poster_path;
            detail.production_companies = await company.find({_id: {$in: production_companies_id}}, {
                _id: 1,
                logo_path: 1,
                name: 1,
                original_country: 1
            });
            detail.spoken_languages = await spoken.find({iso_639_1: {$in: spoken_languages_id}}, {
                iso_639_1: 1,
                name: 1,
                _id: 0
            });
            detail.release_date = result.release_date;
            detail.release_date = result.release_date;
            detail.vote_average = result.vote_average;
            detail.vote_average = result.vote_average;
            detail.tagline = "";
            detail.adult = result.adult;
            detail.homepage = "";
            detail.status = result.status;

            res.status(200).send(detail);
        });

    } catch (e) {
        console.log('upcoming catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }
});

// router.get('/testpagemovie', (req, res) => {
//
//     var response = {
//         status: false,
//     };
//
//     if (!common.validKey(req.query)) {
//         response.msg = "Unauthorized";
//         res.status(401).send(response);
//         return false;
//     }
//
//     try {
//         let perPage = 2; // số lượng sản phẩm xuất hiện trên 1 page
//         let page = parseInt(req.query.page) || 1;
//
//         movie.find()
//             .skip((perPage * page) - perPage)
//             .limit(perPage)
//             .exec((err, data) => {
//                 movie.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
//                     if (err) return next(err);
//                     res.status(200).send(data) ;// Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
//                     console.log(data)
//                 });
//             });
//
//     } catch (e) {
//         console.log('catch err:', e);
//         response.msg = "Unknow error!";
//         res.status(400).send(response);
//     }
// });

router.get('/:movie_id/videos', (req, res) => {
    var response = {
        status: false,
    };

    try {
        var idd = req.params.movie_id
        var results = {};
        var videos = {};
        movie.findOne({_id: idd}, async function (err, result) {
            if (err) console.log(' err:', err);
            let videos_id = result.videos_id;
            if (videos_id == null)
                videos.id = idd;
            videos.results = await video.find({_id: {$in: videos_id}}, {
                id: 1,
                key: 1,
                name: 1,
                site: 1,
                size: 1,
                type: 1
            });
            res.status(200).send(videos);

        });
    } catch (e) {
        console.log('videos trailer err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }
});

router.get('/:movie_id/comment', async (req, res) => {
    var idd = req.params.movie_id;

    var data = await commentRes.getListbyMovieId(idd)
    res.status(200).send(data)
});


router.get('/:movie_id/review', async (req, res) => {
    var idd = req.params.movie_id

    var data = await reviewRes.getListbyMovieId(idd);
    res.status(200).send(data)
});


router.post('/comment/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        comment: body.comment,
        name_user: body.name_user,
        movie_id: body.movie_id,
        created_at: body.created_at,
    };
    let insert = await commentRes.insert(data);
    res.status(200).send(insert);
});


module.exports = router;
//http://localhost:3031/images/nFCUBRDF4C6RWopNo0nAfvMA6mm.jpg