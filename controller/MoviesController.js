const model = require("../model");
const movie = model.model('movie');
module.exports = {
    getList : async ()=>{
        try {
            var data = await movie.find().exec();
            return data;

        }catch (e) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await movie.findById(id);

        } catch (e) {
            console.log('movie getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await movie.create(data);

        } catch (e) {
            console.log('movie insert error:', e.message);
            return false;
        }
    },


    update: async (id, data) => {
        try {
            let item = await movie.findById(id);
            item.backdrop_path = data.backdrop_path;
            item.genre_ids = data.genre_ids;
            item.original_language = data.original_language;
            item.original_title = data.original_title;
            item.overview = data.overview;
            item.popularity = data.popularity;
            item.poster_path = data.poster_path;
            item.release_date = data.release_date;
            item.title = data.title;
            item.vote_average = data.vote_average;
            item.vote_count = data.vote_count;
            item.type = data.type;
            item.status = data.status;
            item.runtime = data.runtime;
            item.casts_id = data.casts_id;
            item.videos_id = data.videos_id;
            item.production_countries_id = data.production_countries_id;
            item.production_companies_id = data.production_companies_id;
            item.spoken_languages_id = data.spoken_languages_id;


            return await item.save();

        } catch (e) {
            console.log('review update error:', e.message);
            return false;
        }
    },

    delete: async (id) => {
        try {
            return await movie.findByIdAndRemove(id);
        } catch (e) {
            return false
        }
    }
};