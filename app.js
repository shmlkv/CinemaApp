var express = require('express');
var pg = require('pg');

var app = module.exports = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/*app.use(express.static(__dirname + '/public'));

pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});*/


app.get('/', function(req, res){
  res.render('home', {word: 'World'});
});

app.listen(process.env.PORT || 3000, function(){
  console.log('app is runned');
});