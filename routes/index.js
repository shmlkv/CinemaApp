var express = require('express'),
    app = module.exports = express();
var config = require('../core/config.json');


var mongoose = require('mongoose');
mongoose.connect(config.db_url);
var db = mongoose.connection;

var Schema = mongoose.Schema;

var filmSchema = new Schema({
    title:  String,
    cover_url: String,
    desc: String,
    genre: Array
    //release_date: { type: Date("<dd.mm.YYYY>")}
});
var cinemasSchema = new Schema({
    company: String,
    city: String,
    address: String
});
var sessionsSchema = new Schema({
    film_id: String,
    cinema_id: String,
    date: [Date]
});
var films = mongoose.model('Films', filmSchema);
var cinemas = mongoose.model('Cinemas', cinemasSchema);
var sessions = mongoose.model('Sessions', sessionsSchema);

db.on('error', console.error);

app.get('/', function(req, res){
    films.find({}).select('title').exec(function(err, data_films){
        if(!err ){
            cinemas.find({}).select('city').exec(function(err, data_cities){

                res.render('home', {
                    title: 'home',
                    films : data_films,
                    cities: data_cities
                });
                console.log("Rendered page " + req.originalUrl)
            });

        }
    });

});



//var f = new Cinemas({
//    company: 'Cinema-city',
//    city: 'ראשון לציון',
//    address: 'ילדי טהרן 3'
//});

// var j = new Films({
// 	title: 'Star Wars: Episode VII - The Force Awakens',
// 	cover_url: 'http://ia.media-imdb.com/images/M/MV5BMTkwNzAwNDA4N15BMl5BanBnXkFtZTgwMTA2MDcwNzE@._V1_SX214_AL_.jpg',
// 	desc: 'המשך לסדרת הסרטים הקלאסית של גורג לוקאס, המתרחש 30 שנה לאחר עלילות הפרק השישי בסדרה מ-1983',
// 	genre: ['Action', 'Adventure', 'Fantas'],
// 	//release_date: { type: Date }
// });

//j.save(function (err) {
//    if (err) return console.log(err);
//    Films.findById(f, function (err, doc) {
//        if (err) return console.log("!" + err);
//        console.log(doc); // { name: 'mongodb.org', _id: '50341373e894ad16347efe12' }
//    })
//})
