const model = require('../model');
const cast = model.model('cast');

module.exports = {
    getById: async (id) => {
        try {
            return await cast.findById(id);

        } catch (e) {
            console.log('cast getById error:', e.message);
            return false;
        }
    },
    insert: async (data) => {
        try {
            return await cast.create(data);

        } catch (e) {
            console.log('cast insert error:', e.message);
            return false;
        }
    },


    update : async (id, data) => {
        try {
            let item = await cast.findById(id);
            item.name = data.name;
            item.adult = data.adult;
            item.gender = data.gender;
            item.known_for_department = data.known_for_department;
            item.original_name = data.original_name;
            item.popularity = data.popularity;
            item.profile_path = data.profile_path;
            item.cast_id = data.cast_id;
            item.character = data.character;
            item.credit_id = data.credit_id;
            item.order = data.order;
            return await item.save();

        } catch (e) {
            console.log('cast update error:', e.message);
            return false;
        }
    },

    delete : async (req, res, next) => {
        try {
            let body = req.body,
                id = body._id;

            const ob =   await cast.findByIdAndRemove(id);

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