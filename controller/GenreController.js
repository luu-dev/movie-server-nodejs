const model = require("../model");
const genre = model.model('genre');
module.exports = {
    getList: async () => {
        try {
            var data = await genre.find().exec();
            return data;

        } catch (e) {
            return false;
        }
    },
    getById: async (id) => {
        try {
            return await genre.findById(id);

        } catch (e) {
            console.log('genre getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await genre.create(data);

        } catch (e) {
            console.log('genre insert error:', e.message);
            return false;
        }
    },


    update : async (id, data) => {
        try {
            let item = await genre.findById(id);
            item.name = data.name;
            item.id = data.id;
            return await item.save();

        } catch (e) {
            console.log('genre update error:', e.message);
            return false;
        }
    },

    delete : async (req, res, next) => {
        try {
            let body = req.body,
                id = body._id;

            const ob =   await genre.findByIdAndRemove(id);

            var response = {
                status: false,
                msg: 'delete success'
            };
            res.status(200).send(response)

        } catch (e) {
            res.status(400).send(e.message)
        }
    }
};