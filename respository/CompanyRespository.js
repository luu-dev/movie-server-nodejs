const model = require("../model");
const company = model.model('production_company');
module.exports = {
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
            item.logo_path = data.logo_path;
            item.origin_country = data.origin_country;
            return await item.save();

        } catch (e) {
            console.log('company update error:', e.message);
            return false;
        }
    },

    deleteCompany : async (req, res, next) => {
        try {
            const id = req.param.id;
            const ob =   await company.findByIdAndRemove(id);

            res.status(200).send("delete success")

        } catch (e) {
            res.status(400).send(e.message)
        }
    }
};