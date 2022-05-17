const model = require("../model");
const spokenlangue = model.model('spokenlangue');
module.exports = {
    getList : async ()=>{
        try {
            var data = await spokenlangue.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await spokenlangue.findById(id);

        } catch (e) {
            console.log('spokenlangue getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await spokenlangue.create(data);

        } catch (e) {
            console.log('spokenlangue insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await spokenlangue.findById(id);
            item.iso_639_1 = data.iso_639_1;
            item.name = data.name;

            return await item.save();

        } catch (e) {
            console.log('spokenlangue update error:', e.message);
            return false;
        }
    },

    delete: async (id) => {
        try {
            return await spokenlangue.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    }
};