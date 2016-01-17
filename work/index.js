var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db = require('./db');
var url = 'mongodb://localhost:27017/sn';
var cookieParser  = require('cookie-parser');
var session = require('express-session');
var cons = require('consolidate');

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',
                  resave: false,
                  saveUninitialized: false

}));

var sess;

app.engine('html', cons.underscore);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/login',require('./routes/account'));
app.use('/', require('./routes/base'));

app.use(function(req, res, next){
  res.status(404);
  //réponse avec une page html
  if(req.accepts('html')){
    res.render('404',{title: 'Erreur', titreH1: 'Page inconnue', imgFoot :'error.jpg'});
    return;
  }
  //réponse avec du json
  if(req.accepts('json')){
    res.render({error: 'fichier absent'});
    return;
  }
  //réponse avec un ficheir texte
  res.type('text').send('Pas de réponse');
});


db.connect(url, function(err, db) {
  if (err) {
    process.exit(1);
    console.log('impossible de ce connecter à la base');
  }
  var serveur = app.listen(8080, function(){
    var adresseHote = serveur.address().address;
    var portEcoute = serveur.address().port;
    console.log('L\'application est disponnible à l\'adreese http://%s:%s', adresseHote, portEcoute);
  });
});