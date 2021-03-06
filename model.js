const config = require('config');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

mongoose.connect(config.get('mongo_db'), {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new Schema({
    name: String,
    password: String,
});
var castSchema = new Schema({
    gender: Number,
    known_for_department: String,
    original_name: String,
    popularity: Number,
    profile_path: String,
    character: String
});
var genreSchema = new Schema({
    id: Number,
    name: String,
});
var productionCompanySchema = new Schema({
    id: Number,
    logo_path: String,
    name: String,
    origin_country: String
});

var movieSchema = new Schema({
    adult: Boolean,
    backdrop_path: String,
    genre_ids: Object,
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    type: Number,
    status: String,
    spoken_languages_id: Object,
    runtime: Number,
    production_countries_id: Object,
    production_companies_id: Object,
    casts_id: Object,
    videos_id: Object
});
var production_countrySchema = new Schema({
    iso_3166_1: String,
    name: String
});
var spokenlangueSchema = new Schema({
    iso_639_1: String,
    name: String
});
var videoSchema = new Schema({
    id: String,
    iso_639_1: String,
    iso_3166_1: String,
    key: String,
    name: String,
    site: String,
    size: Number,
    type: String
});


var commentsSchema = new Schema({
    comment: String,
    name_user: String,
    movie_id: String,
    created_at: String,
});

var reviewsSchema = new Schema({
    content: String,
    movie_id: String,
    created_at: { type: Date, default: Date.now },
    url: String
});


var notificationsSchema = new Schema({
    content: String,
    status: String,
    created_at: String,
    user_name: String
});



//Export model
module.exports = mongoose.model('user', userSchema);
module.exports = mongoose.model('cast', castSchema);
module.exports = mongoose.model('genre', genreSchema);
module.exports = mongoose.model('production_company', productionCompanySchema);
module.exports = mongoose.model('movie', movieSchema);
module.exports = mongoose.model('production_country', production_countrySchema);
module.exports = mongoose.model('spokenlangue', spokenlangueSchema);
module.exports = mongoose.model('video', videoSchema);
module.exports = mongoose.model('comment', commentsSchema);
module.exports = mongoose.model('review', reviewsSchema);
module.exports = mongoose.model('notification', notificationsSchema);


//create object to insert,update,delete
