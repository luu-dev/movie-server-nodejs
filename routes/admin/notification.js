var express = require('express');
var router = express.Router();
// const bodyParser = require("body-parser");
let sseExpress = require("sse-express");
// let e = require("events");
const notifiRes = require('../../controller/NotificationController');
const userRes = require('../../controller/UserController');

router.get('/', function (req, res, next) {
    res.render('admin/notification/index', {title: 'notification'});
});

router.post('/listuser', async function (req, res, next) {
    var list = await userRes.getList();

    res.status(200).send(list)

});

router.post('/update', async function (req, res, next) {
    let body = req.body;
    //     id = body.id;
    console.log(body.status);
    let date = new Date();
    let update = await notifiRes.update('627f230a385625c816b7646d', {
        content: body.content,
        status: body.status,
        created_at: date.toLocaleDateString('en-GB').split('/').reverse().join('/'),
        user_name: body.user_name,
    });
    res.status(200).send(update);
});


router.get('/message', sseExpress,  function (req, res) {
    var check = false
    var i = 0;
    setInterval(async () => {

        // if (data.status === "pending")
        //     return;
        // else {
            await notifiRes.getById('627f230a385625c816b7646d').then(
                (data) =>{
                    if (data.status === "update") {

                        res.sse('message', {
                            data: data
                        });
                        check = true
                    }
                }
            );
            if (check = true){
                await notifiRes.update('627f230a385625c816b7646d',{
                    content: "",
                    status: "pending",
                    created_at: "",
                    user_name: "",
                });
                i = 0;
                check = false
            }

            // notifiRes.update('627f230a385625c816b7646d',{
            //     content: "",
            //     status: "pending",
            //     created_at:""
            //     ,
            //     user_name: "",
            // });
       // }
    }, 5000)

});

module.exports = router;
