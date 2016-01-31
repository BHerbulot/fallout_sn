var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db');
var session = require('express-session');
var tools = require('../tools');

router.use(express.static('views'));


router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false

}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


//**********************************************************************************
// For connect
//**********************************************************************************

router.get('/', function(req, res) {
    if (req.session.user) {
        console.log('go to home');
        res.render('home');
    } else {
        console.log('go to login');
        res.redirect('login');
    }


});

router.get('/disconnect', function(req, res) {
    console.log('Dicsonnect');
    req.session.destroy(function(error) {
        if (error)
            console.log('error for destroy the seesion');
        res.redirect('/');
    });

});

router.get('/getMembers', function(req, res) {
    var coll = db.get().collection('user');
    coll.find().toArray(function(err, docs) {
        res.json({
            members: docs,
            user: req.session.user
        });
    });
});

router.get('/getCurrentUser', function(req, res) {
    res.json({
        user: req.session.user
    });
});

router.get('/getFriends', function(req, res) {
    var coll = db.get().collection('friends');
    coll.find({
        user: req.session.user
    }).toArray(function(err, docs) {
        console.log('getFriends');
        var doc = docs[0] === undefined ? {}: docs[0];
        if(doc.friends.length === 0 && doc.invite.length === 0 && doc.invitation.length === 0 ){
        	console.log('pas d\'amis');
        	res.json({no_friends:true});
        }else{
        	var member_coll = db.get().collection('user');

        	var fields_checked = 0;
        	var fields_target = 3;
        	var obj_res = {};

        	console.log(doc.friends);
        	if(doc.friends.length !== 0){
        		console.log('ok');
        		member_coll.find({user: {$in: doc.friends}}).toArray(function(err, result){
        			console.log(result);
        			fields_checked++;
        			obj_res.friends = result;
        			tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        		});
        	}else{
        		fields_checked++;
    			tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        	}
        	if(doc.invite.length !== 0){
        		member_coll.find({user: {$in: doc.invite}}).toArray(function(err, result){
        			obj_res.friends = result;
        			 fields_checked++;
        			 tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        		});
        	}else{
        		fields_checked++;
    			tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        	}
        	if(doc.invitation.length !== 0){
        		member_coll.find({user: {$in: doc.invitation}}).toArray(function(err, result){
        			obj_res.friends = result;
        			 fields_checked++;
        			 tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        		});
        	}else{
        		fields_checked++;
    			tools.wait_for_res(res, fields_target, fields_checked, obj_res);
        	}
        }


/*        res.json({
            doc: doc,
            user: req.session.user
        });*/
    });
});

router.post('/inviteMember', function(req, res) {
    console.log('/inviteMember');
    var coll = db.get().collection('friends');

    //add invitation to sender friends coll
    coll.find({
        user: req.body.user_sender
    }).toArray(function(err, docs) {
        if (err) {
            console.log('error');
            res.json({
                erreur: true
            });
        }

        if (docs.length > 0) {
            console.log("update");
            coll.update({
                user: req.body.user_sender
            }, {
                $push: {
                    invite: req.body.user_host
                }
            }, function(err, results) {
                res.json({
                    res: "ok"
                });
            });
        } else {
            console.log("create");

            coll.insert({
                user: req.body.user_sender,
                friends: [],
                invite: [req.body.user_host],
                invitation: []
            }, function(err, result) {
                res.json({
                    res: "ok"
                });
            });
        }
    });
});

module.exports = router;