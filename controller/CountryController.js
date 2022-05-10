const model = require("../model");
const country = model.model('production_country');
module.exports = {
    getList : async ()=>{
        try {
            var data = await country.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await country.findById(id);

        } catch (e) {
            console.log('country getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await country.create(data);

        } catch (e) {
            console.log('company insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await country.findById(id);
            item.iso_3166_1 = data.iso_3166_1;
            item.name = data.name;

            return await item.save();

        } catch (e) {
            console.log('country update error:', e.message);
            return false;
        }
    },

    delete: async (id) => {
        try {
            return await company.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    }
};