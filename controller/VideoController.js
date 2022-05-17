const model = require("../model");
const video = model.model('video');
module.exports = {
    getList : async ()=>{
        try {
            var data = await video.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await video.findById(id);

        } catch (e) {
            console.log('video getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await video.create(data);

        } catch (e) {
            console.log('video insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await video.findById(id);
            item.iso_639_1 = data.iso_639_1;
            item.iso_3166_1 = data.iso_3166_1;
            item.name = data.name;
            item.key = data.key;
            item.site = data.site;
            item.size = data.size;
            item.type = data.type;

            return await item.save();

        } catch (e) {
            console.log('spokenlangue update error:', e.message);
            return false;
        }
    },

    delete: async (id) => {
        try {
            return await video.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    }


};