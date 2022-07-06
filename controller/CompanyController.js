const model = require("../model");
const company = model.model('production_company');
module.exports = {
    getList: async () => {
        try {
            var data = await company.find().exec();
            return data;

        } catch (e) {
            return false;
        }
    },
    getById: async (id) => {
        try {
            return await company.findById(id);

        } catch (e) {
            console.log('company getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await company.create(data);

        } catch (e) {
            console.log('company insert error:', e.message);
            return false;
        }
    },


    update : async (id, data) => {
        try {
            let item = await company.findById(id);
            item.name = data.name;
            item.origin_country = data.origin_country;
            if(data.logo_path) item.logo_path = data.logo_path;
            return await item.save();

        } catch (e) {
            console.log('company update error:', e.message);
            return false;
        }
    },

    delete : async (req, res, next) => {
        try {
            let body = req.body,
                id = body._id;

            const ob =   await company.findByIdAndRemove(id);

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