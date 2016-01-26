var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db');
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

router.get('/disconnect', function(req, res){
  console.log('Dicsonnect');
  req.session.destroy(function(error){
    if(error)
      console.log('error for destroy the seesion');
    res.redirect('/');
  });

}); 

router.get('/getMembers', function(req, res){
	var coll = db.get().collection('user');
	coll.find().toArray(function(err, docs){
		res.json({members: docs, user: req.session.user});
	});
});

router.get('/getCurrentUser', function(req, res){
	res.json({user: req.session.user});
});

router.get('/getFriends', function(req, res){
	var coll = db.get().collection('friends');
	coll.find().toArray(function(err, docs){
		res.json({members: docs, user: req.session.user});
	});
});

router.post('/inviteMember', function(req, res){
	console.log('/inviteMember');
	var coll = db.get().collection('friends');

	//add invitation to sender friends coll
	coll.find({user: req.body.user_sender}).toArray(function(err, docs){
		if(err) {
			console.log('error');
			res.json({erreur: true});
		}

		if(docs.length > 0){
			console.log("update");
			coll.update(
				{user: req.body.user_sender},
				{$push: {invite: req.body.user_host}}
			);
			
		}else{
			console.log("create");

			coll.insert({
		        user: req.body.user_sender,
		        friends: [],
		        invite: [req.body.user_host],
		        invitation: []
		    }, function(err, result) {
		        res.json({res:"ok"});
		    });
		}
	});
});

module.exports = router;
