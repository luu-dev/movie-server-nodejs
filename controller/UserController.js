
const model = require("../model");
const user = model.model('user');
module.exports = {

    getListbyId: async (ids) => {
        try {
            return  await user.find.where('_id').in(ids).exec();
        } catch (e) {
            return false
        }
    }

};


