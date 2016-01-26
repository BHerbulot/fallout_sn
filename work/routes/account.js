var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db');
var session = require('express-session');
var tools = require('../tools');

//router.use(express.static('views'));
//router.use('/login', express.static(__dirname  +'/login'));


router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false

}));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/', function(req, res) {
    res.render('login');

});
//**********************************************************************************
// For connect
//**********************************************************************************


router.post('/tryConnection', function(req, res) {
    console.log('try to connect');
    console.log(req.body);
    var col = db.get().collection('user');
    col.find({
        user: req.body.user
    }).toArray(function(err, docs) {
        if (err) throw err;
        console.log(docs);
        if (docs.length <= 0) {
            res.json({
                res: 'error'
            });
        } else {
            if (docs[0].pwd == req.body.pwd) {
                console.log('redirect');
                req.session.user = req.body.user;
                res.json({res: "ok"});
            } else {
                console.log('wrong mdp');
                res.json({
                    res: 'error'
                });
            }
        }
    });
});

router.post('/tryInscription', function(req, res) {
    //res.json({res: 'ok'});

    var verif = tools.form_verification([{
            content: req.body.user,
            type: 'name'
        }, {
            content: req.body.email,
            type: 'email'
        }, {
            content: req.body.pwd,
            type: 'pwd'
        }, {
            content: req.body.checked_pwd,
            pwd: req.body.pwd,
            type: 'checked_pwd'
        }

    ]);

    var form_ok = true;
    verif.forEach(function(doc) {
        if (!doc.type) {
            form_ok = false;
        }
    });
    if (!form_ok) {
        res.json({
            bad_form: verif
        });
        console.log('error form');
    } else {
        var collection = db.get().collection('user');
        collection.find({ user: req.body.user }).toArray(function(err, docs) {
            if (docs.length > 0) {
                res.json({ user_already_exist: true});
                console.log("pseudo already used");
            } else {
                collection.insert({
                    user: req.body.user,
                    pwd: req.body.pwd,
                    email: req.body.email
                }, function(err, result) {
                    req.session.user = req.body.user;
                    console.log('userName Saved');
                    res.json({res:"ok"});
                    //res.redirect('/');
                });
            }
        });
    }
});


module.exports = router;