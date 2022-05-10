const model = require('../model');
const cast = model.model('cast');

const getAllCasts = async (req, res, next) => {
    const list = await cast.find().exec();
    res.render('cast_list:', {
        casts: list
    });

};
module.exports = {getAllCasts};