var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var db = require('../db');
var session = require('express-session');

router.use(express.static('views'));


router.use(session({ secret: 'keyboard cat',
                  resave: false,
                  saveUninitialized: false

}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


//**********************************************************************************
// For connect
//**********************************************************************************

router.get('/', function(req,res){
	if(req.session.user){
		console.log('go to home');
		res.render('home');
	}else{
		console.log('go to login');
		res.redirect('login');
	}
 	

});


module.exports = router;
