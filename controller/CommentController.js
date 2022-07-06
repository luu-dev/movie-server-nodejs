const model = require("../model");
const comment = model.model('comment');
module.exports = {
    getList : async ()=>{
        try {
            var data = await comment.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await comment.findById(id);

        } catch (e) {
            console.log('video getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await comment.create(data);

        } catch (e) {
            console.log('video insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await comment.findById(id);
            item.comment = data.comment;
            item.name_user = data.name_user;
            item.movie_id = data.movie_id;
            item.created_at = data.created_at;

            return await item.save();

        } catch (e) {
            console.log('review update error:', e.message);
            return false;
        }
    },

    delete: async (id) => {
        try {
            return await comment.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    },
    getListbyMovieId : async(id) =>{
        try {
            var data = comment.find({ 'movie_id': id }).exec();
            return data;
        }
        catch (e) {
            return false
        }

    }
};