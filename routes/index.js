var express = require('express'),
    app = module.exports = express();
var config = require('../core/config.json');
var request = require("tiny_request"),
    cheerio = require("cheerio");
var moment = require('moment'),
    mongoose = require('mongoose');
mongoose.connect(config.db_url);

var bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false});

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
        cinemas.find({}).select('city').exec(function(err, data_cities){
            sessions.find({}).select('date').exec(function (err, data_sessions) {
                res.render('home', {
                    title: 'home',
                    films: data_films,
                    cities: data_cities,
                    dates: data_sessions
                });
                console.log("Rendered page " + req.originalUrl)
            });
        });

    });
});

app.get('/dashboard', function(req, res){
    res.render('dashboard', {
        title: 'home'
    });
    console.log("Rendered page " + req.originalUrl)
});

app.post('/period', urlencodedParser, function (req, res) {
    date_from = moment(req.body.date_from, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    date_to =  moment(req.body.date_to, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');

    sessions.find({"date": {'$gte': date_from, '$lt': date_to}}).select('_id').exec(function (err, data_sessions) {
        if(err) console.log(err);
            res.render('period', {
            title: 'period',
            date_from: date_from,
            date_to: date_to,
            data_sessions: data_sessions
        });
    });
    console.log("Rendered page " + req.originalUrl)
});

app.get('/api/sessionsbetweendates?', urlencodedParser, function (req, res) {
    var data_films = [],
        resp = {};
    date_from = moment(req.query.date_from, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    date_to =  moment(req.query.date_to, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');

    sessions.find({"date": {'$gte': date_from, '$lt': date_to}}).exec(function (err, db_sessions) {
        db_sessions.forEach(function (session, index) {
            films.find({'_id': session.film_id}).exec(function (err, db_film) {
                data_films.push(db_film[0]);

                if (db_sessions.length-1 == index){
                    resp.sessions = db_sessions;
                    resp.films = data_films;

                    res.send(resp);
                    console.log("Rendered page " + req.originalUrl)
                }
            });
        });
    });
});

app.get('/api/getCinemas', function (req, res) {
    cinemas.find({}).exec(function (err, data_cinemas) {
            res.send(data_cinemas);
        console.log("Rendered page " + req.originalUrl)
    });
});

app.get('/dashboard/parseKinorai', function (req, res) {
    request.get({ url: 'http://kinorai.co.il/extra/', encoding:'binary'}, function(body, response, err){
        if (!err && response.statusCode == 200) {
            var $=cheerio.load(body);

            ulFilms = $('.films-list .cinema').toArray();
            ulFilms.forEach(function (film) {
                //console.log(film.children[0].children[0].data)// - Кинотеатры
                if(film.children[0].next.children[0].next){
                    liFilm = film.children[0].next.children;
                    liFilm.forEach(function (liFilm,index, array) {
                        if(liFilm.children){
                            if(liFilm.children[1].attribs.href){
                                link = liFilm.children[1].attribs.href;
                                title = liFilm.children[1].attribs.title;
                                img = liFilm.children[1].children[0].next.attribs.src;
                                dateNonFormated = liFilm.children[1].children[0].next.next.next.children[0].next.next.next.children[0].data;
                                var thisyear = moment().format('YYYY');
                                date =  moment(thisyear + dateNonFormated, 'YYYYDD-MM HH:mm').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
                                console.log( title + ' - ' + link);

                            }
                        }
                    });
                }
            });
            res.redirect('back');

        }
        else{
            console.log(err);
        }
    })
});

//app.get('/api/filmsFiltered', urlencodedParser, function (req, res) {
//    date_from = moment(req.query.date_from, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
//    date_to =  moment(req.query.date_to, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
//
//    cinemas.find({}).select('_id').exec(function(err, data_ids){
//        sessions.find({"date": {'$gte': date_from, '$lt': date_to}})./*select('_id').*/exec(function (err, data_sessions) {
//
//
//        });
//
//
//    sessions.find({"date": {'$gte': date_from, '$lt': date_to}})./*select('_id').*/exec(function (err, data_sessions) {
//        console.log(data_sessions);
//        //films.find({"_id": })./*select('_id').*/exec(function (err, data_sessions) {
//        //
//        //});
//        if(err) console.log(err);
//        res.send(data_sessions);
//    });
//    console.log("Rendered page " + req.originalUrl)
//    });
//var f = new cinemas({
//    company: 'Cinema-city',
//    city: 'ראשון לציון',
//    address: 'ילדי טהרן 3'
//});

// var j = new films({
// 	title: 'Star Wars: Episode VII - The Force Awakens',
// 	cover_url: 'http://ia.media-imdb.com/images/M/MV5BMTkwNzAwNDA4N15BMl5BanBnXkFtZTgwMTA2MDcwNzE@._V1_SX214_AL_.jpg',
// 	desc: 'המשך לסדרת הסרטים הקלאסית של גורג לוקאס, המתרחש 30 שנה לאחר עלילות הפרק השישי בסדרה מ-1983',
// 	genre: ['Action', 'Adventure', 'Fantas'],
// 	//release_date: { type: Date }
// });

//var j = new sessions({
//    film_id: 313123,
//    cinema_id: 3123321,
//    date: new Date().toISOString()
//});

//j.save(function (err) {
//    if (err) return console.log(err);
//    sessions.findById(j, function (err, doc) {
//        if (err) return console.log("!" + err);
//        console.log(doc); // { name: 'mongodb.org', _id: '50341373e894ad16347efe12' }
//    })
//})