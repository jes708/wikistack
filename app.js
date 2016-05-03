var express = require( 'express' );
var app = express();
var swig = require('swig');
var path = require('path');
var bodyParser = require('body-parser');
var wikiRouter = require('./routes/wiki');
var models = require('./models');
var bluebird = require('bluebird');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/wiki', wikiRouter);// ... other stuff


var server = app.listen(3000, function () {
  console.log('Now listening on port 3000!');
});



app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });





models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    server.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

app.use(express.static(path.join(__dirname, './stylesheets')));