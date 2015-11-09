var express = require('express');
var config = require('./core/dbconfig.json');
var mongoose = require('mongoose');
var index = require('./routes/index');
var pg = require('pg');

var app = module.exports = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use('/', index);
app.use(express.static(process.cwd() + '/public'));

db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	Schema = mongoose.Schema;
 var Schema = mongoose.Schema;

 var filmSchema = new Schema({
   title:  String,
   cover: String,
   cinema:   String,
   date: { type: Date, default: Date.now }
 });
 var Films = mongoose.model('Films', filmSchema);
 var f = new Films({
 	title: 'FILMNAME'
 });

 f.save(function (err) {
   if (err) return handleError(err);
   Films.findById(f, function (err, doc) {
     if (err) return handleError("!" + err);
     console.log(doc); // { name: 'mongodb.org', _id: '50341373e894ad16347efe12' }
   })
 })
});
console.log(config.url);
mongoose.connect(config.url2);

app.listen(process.env.PORT || 3000, function(){
  console.log('app is runned');
});