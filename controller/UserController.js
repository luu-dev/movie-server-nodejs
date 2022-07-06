const model = require("../model");
const user = model.model('user');
module.exports = {

    getListbyId: async (ids) => {
        try {
            return  await user.find.where('_id').in(ids).exec();
        } catch (e) {
            return false
        }
    },
    insert: async (data) => {
        try {
            return await user.create(data);

        } catch (e) {
            console.log(' insert error:', e.message);
            return false;
        }
    },

    getList: async () => {
        try {
            var data = await user.find().exec();
            return data;

        } catch (e) {
            return false;
        }
    }

};


