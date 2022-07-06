var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../../model");
const company = model.model('production_company');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
// const { promisify } = require('util');

// const unlinkAsync = promisify(fs.unlink);
const companyRes = require('../../controller/CompanyController');
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        let file_name = Date.now()+"_"+file.originalname;
        cb(null, file_name)
    }
});

var upload1 = multer({storage: storage1});

const _path_img_upload = './public/images/';


router.get('/', function (req, res, next) {
    res.render('admin/company/index', {title: 'Company list'});
});

router.post('/list', function (req, res, next) {
    try {
        var data = company.find().exec()
            .then(data => {
                res.status(200).send(data);
            });

    } catch (e) {
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

    } catch (e) {
        console.log('Company get one:', e.message);
        res.status(400);
    }
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, _path_img_upload + 'tmp')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// const upload = multer({dest: _path_img_upload, storage: storage});
router.post('/insert', upload1.single('img'), async function (req, res) {
    const body = req.body;
    // const file = req.file;
    // // console.log(req);
    // console.log(file, body);
    //
    // upload(req, res, async function(err) {
    //     // check for error thrown by multer- file size etc
    //     if( err|| req.file === undefined){
    //         console.log(err);
    //         res.send("error occured")
    //     }else{
    //         let date = new Date(),
    //             original_name = file.originalname,
    //             name_split = original_name.split('.'),
    //             type = name_split[name_split.length - 1];
    //
    //         // everything worked fine // req.body has text fields, req.file has the file
    //         let file_name = 'lol_' + date.getMilliseconds() + '.' . type;
    //         var image = await sharp(req.file.buffer) //.resize({ width: 400, height:400 }) Resize if you want
    //             .jpeg({
    //                 quality: 40,
    //             }).toFile(_path_img_upload + file_name)
    //             .catch( err => { console.log('error: ', err) });
    //         res.send(req.body)
    //     }
    // });

    /*if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }*/
    var data = {
        id: -1,
        name: body.name,
        // logo_path: body.logo_path,
        origin_country: body.origin_country,
    };
    //add file if exist
    if(req.file) {
        const file = req.file;
        data['logo_path'] = file.filename;
    }

    let insert = await companyRes.insert(data);
    res.redirect('/admin/company')
});

router.post('/update',  upload1.single('img'),async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;

        let data_update = {
            name: body.name,
            // logo_path: body.logo_path,
            origin_country: body.origin_country,
        };

        //Start: handle file
        let old_logo_path = '';
        if(req.file) {
            const file = req.file;
            let file_name = file.filename;

            //remove old file if have new file
            let company_item = await companyRes.getById(id);
            old_logo_path = company_item ? company_item.logo_path : '';

            //only update if have new file
            data_update['logo_path'] = file_name;
        }
        //End: handle file

        let update = await companyRes.update(id, data_update);

        //remove old file
        if(old_logo_path) {
            console.log('Remove file start:', _path_img_upload + old_logo_path);
            fs.stat(_path_img_upload + old_logo_path, function (err, stats) {
                if (err) {
                    console.error('Remove file error:', err);
                } else {
                    fs.unlink(_path_img_upload + old_logo_path,function(err){
                        if(err) return console.log(err);
                        console.log('Remove file successfully');
                    });
                }
            });
        }

        res.redirect('/admin/company')

    } catch ( e ) {

    }
});



router.post('/delete',async (req, res, next) => {
    try {
        let body = req.body,
            id = body._id;


        const ob =   await company.findByIdAndRemove(id);
        let company_item = await companyRes.getById(id);
        old_logo_path = company_item ? company_item.logo_path : '';
        if(old_logo_path) {
            fs.stat(_path_img_upload + old_logo_path, function (err, stats) {
                if (err) {
                    console.error('Remove file error:', err);
                } else {
                    fs.unlink(_path_img_upload + old_logo_path,function(err){
                        if(err) return console.log(err);
                        console.log('Remove file successfully');
                    });
                }
            });
        }
        var response = {
            status: false,
            msg: 'delete success'
        };
        res.status(200).send(response)

    } catch (e) {
        res.status(400).send(e.message)
    }
});



module.exports = router;
