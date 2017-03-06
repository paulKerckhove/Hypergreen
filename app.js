let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let index = require('./routes/index');
// let users = require('./routes/users');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');


var app = express();

// var server = app.listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);



function scrapeData(){
  var url = 'http://www.imdb.com/title/tt0068646/fullcredits';

  //Makes the request to the given URL

  request(url, function (error, response, body){
    if (error){
      console.log(error);
    }

    let $ = cheerio.load(body);
    var actor = [];
    var castList = $('.cast_list .primary_photo .loadlate')
    castList.each(function(index, elem){
      actor.push($(elem).attr('alt'))
      actor.length = actor.length < 10 ? actor.length : 10;
    })
    console.log(actor);
  })
}
scrapeData();



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
