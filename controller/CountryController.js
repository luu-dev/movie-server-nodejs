const model = require("../model");
const country = model.model('production_country');
module.exports = {

    insertCountry: async (req, res, next) => {
        try {
            const body = req.body;
            var data = {
                iso_3166_1 : body.iso_3166_1,
                name: body.name
            };


            await country.create(data);
            res.status(200).send(data);

        } catch (e) {
            res.status(400).send(e)
        }

    },


    updateCountry : async (req, res, next) => {
        try {
            const  _id = req.params._id;
            const body = req.body;
            var data = {
                iso_3166_1 : body.iso_3166_1,
                name: body.name

            };
            let ob = await company.findByIdAndUpdate(_id,data,{new : true});

            res.status(200).send(data)

        } catch (e) {
            res.status(400).send(e.message)
        }
    },

    deleteCountry : async (req, res, next) => {
        try {
            const id = req.param.id;
            const ob =   await country.findByIdAndRemove(id);

            res.status(200).send("delete success")

        } catch (e) {
            res.status(400).send(e.message)
        }
    }
};