var express = require('express');
var index = require('./routes/index');
var app = module.exports = express();


app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use('/', index);
app.use(express.static(process.cwd() + '/public'));


app.listen(process.env.PORT || 3000, function(){
  console.log('app is runned');
});