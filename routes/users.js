var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../model");
const user = model.model('user');

router.use(bodyParser.urlencoded({ extended: false }));
/* GET users listing. */
router.get('/', function (req, res) {
    res.render("login");

});



// router.get('/get-data', function (req, res, next) {
//     var result = [];
//     var cusor = model.collection('moviedb').find();
//     cusor.forEach(function (doc, err) {
//         result.push(doc)
//     }, function () {
//         model.close();
//         res.status(200).send(result);
//     })
// });
router.post('/', function (req, res, next) {
    var response = {
        status: false,
    };

    try {
        var body = req.body;
        if(body.name && body.password) {
            user.findOne({name: body.name, password: body.password}, function (err, result) {
                if (err) {console.log('User login err:', err);
                    res.status(400).send('Unknow');
                }
                // console.log('result', result);
                else {
                    if(result==null)  res.status(400).send('Wrong username or password');
                    else {
                        req.session.username=result.name;
                        res.status(200).send('sucess');
                    //res.render("movie")
                        }

                }

            });
        } else {
            response.msg = "Username or password invalid!";
            res.status(400).send(response);
        }
    } catch (e) {
        console.log('User login catch err:', e);
        response.msg = "Unknow error!";
        res.status(400).send(response);
    }

});



module.exports = router;
