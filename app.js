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

let app = express();

let mongoose = require('mongoose');
var db = mongoose.connection;
let Schema = mongoose.Schema;

mongoose.connect('localhost:27017/popcorn', function(err, result){
  if (err){
    console.log(err);
  }
});

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
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to mongodb");
// });


  // ====================================== //
  //                 setup                  //
  // ====================================== //


// {
//   brew services start mongodb
//   mongo services mongodb
//   npm run server
// }


// let userDataSchema = new Schema({
//   title: String
//
// })












let movieSchema = new Schema({
  _id: String
  , imdb_id: String
  , title: String
  , year: String
  , cast: Array
  , slug: String
  , synopsis: String
  , runtime: String
  , country: String
  , last_updated: Number
  , released: Number
  , certification: String
  , torrents: Object
  , trailer: String
  , genres: Array
  , images: Object
  , rating: Object
  , __v: Number
})


// let id_movie = mongoose.model('movie', movieSchema);
//
// id_movie.findOne({'imdb_id' : 'tt3470600'}, function (err, movie){
//   if (err){
//     console.log(err);
//   } else {
//     console.log(movie.title);
//     console.log(movie.id);
//     console.log(movie.runtime);
//   }
// })






let moviesCollection = mongoose.model('movie', movieSchema);
let casting = [
  "paul",
  "pierre",
  "poulet"
];


moviesCollection.update({_id : 'tt3470600'}, { cast: casting }, {upsert: true}, function (err, moviesCollection){
  if (err){
    console.log(err);
  } else {
    console.log("update ok");
  }
})



// var cast1 = new casting({cast : cast});
// cast1.save(function (err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("it in ! ");
//   }
// })














function scrapeData(){
  let url = 'http://www.imdb.com/title/tt0068646/fullcredits';

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
// scrapeData();






function scrapeCast(){


  let id = "tt0099685";
  let url1 = "http://www.imdb.com/title/";
  let url2 = "/fullcredits";
  let imdbUrl = url1 + id + url2;


  let interestingPart = [];
  let result = [];


      request(imdbUrl, function (error, response, body){
        if (error){
          console.log(error);
        }

        let $ = cheerio.load(body)
        let actor = {};
        let array = [];
        let castList = $('.cast_list .primary_photo .loadlate')

          castList.each(function(index, elem){

            array.push($(elem).attr('alt'))
            array.length = array.length < 10 ? array.length : 10;


        })
        result.push({id, actors : array})
        console.log(result);


      })

}
// scrapeCast();









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
