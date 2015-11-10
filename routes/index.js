var express = require('express'),
	app = module.exports = express();
var config = require('../core/dbconfig.json');

var mongoose = require('mongoose');
mongoose.connect(config.db_url);
var db = mongoose.connection;

var getTitles = false,
	title_arr = [];

db.on('error', console.error);

app.get('/', function(req, res, next){
	var response = function () {
		if (getTitles) {
			res.render('home', {
				title: 'Recent games',
				word: 'WORLD',
				arr : title_arr
			});
		}
		console.log(title_arr);
	};
	db.once('open', function() {
		var Schema = mongoose.Schema;

		var filmSchema = new Schema({
			title:  String,
			cover_url: String,
			desc: String,
			genre: Array,
			//release_date: { type: Date("<dd.mm.YYYY>")}
		});

		var films = mongoose.model('Films', filmSchema);
		
		films.find(function (err, films) {
			if (err) return console.error(err);
				films.forEach(function(film, index, array) {
					title_arr.push(film.title);
					if (index == films.length-1){
						getTitles = true;
						response();
					}
				});
		});
	});
});

