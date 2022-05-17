const model = require("../model");
const review = model.model('review');
module.exports = {
    getList : async ()=>{
        try {
            var data = await review.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await review.findById(id);

        } catch (e) {
            console.log('video getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await review.create(data);

        } catch (e) {
            console.log('video insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await review.findById(id);
            item.content = data.content;
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
            return await review.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    },
    getListbyMovieId : async(id) =>{
        try {
            var data = review.find({ 'movie_id': id });

            return data;
        }
        catch (e) {
            return false
        }

    }
};