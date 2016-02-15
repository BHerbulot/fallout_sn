var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db');
var session = require('express-session');
var tools = require('../tools');
var promise = require('promise');
var mongodb = require('mongodb');

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
        if (error){console.log('error for destroy the seesion');}
        res.redirect('login');
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
    console.log(req.session.user);
    coll.find({
        user: req.session.user
    }).toArray(function(err, docs) {
        console.log('getFriends');
        if (typeof docs[0] === 'undefined') {
        	 res.json({
                no_friends: true
            });
        	 return;
        }
        console.log(docs);
        var doc = docs[0] === undefined ? {} : docs[0];
        if (doc.friends.length === 0 && doc.invite.length === 0 && doc.invitation.length === 0) {
            res.json({
                no_friends: true
            });
        } else {
            var member_coll = db.get().collection('user');

            var fields_checked = 0;
            var fields_target = 3;
            var obj_res = {
            	//simple_avatar: "img/avatar.png",
            };


            if (doc.friends.length !== 0) {
                console.log('ok');
                member_coll.find({
                    user: {
                        $in: doc.friends
                    }
                }).toArray(function(err, result) {
                    fields_checked++;
                    obj_res.friends = result;
                    tools.wait_for_res(res, fields_target, fields_checked, obj_res);
                });
            } else {
                fields_checked++;
                tools.wait_for_res(res, fields_target, fields_checked, obj_res);
            }
            if (doc.invite.length !== 0) {
            	console.log('invite');
                member_coll.find({
                    user: {
                        $in: doc.invite
                    }
                }).toArray(function(err, result) {
                    obj_res.invites = result;
                    fields_checked++;
                    tools.wait_for_res(res, fields_target, fields_checked, obj_res);
                });
            } else {
                fields_checked++;
                tools.wait_for_res(res, fields_target, fields_checked, obj_res);
            }
            if (doc.invitation.length !== 0) {
            	console.log('invitation');
                member_coll.find({
                    user: {
                        $in: doc.invitation
                    }
                }).toArray(function(err, result) {
                    obj_res.invitations = result;
                    fields_checked++;
                    tools.wait_for_res(res, fields_target, fields_checked, obj_res);
                });
            } else {
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
    var nb_fields = 2,
		nb_fields_checked = 0,
		obj_res = {
			res: true
		};
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
                    invitation: req.body.user_host
                }
            }, function(err, results) {
             	nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
        } else {
            console.log("create");

            coll.insert({
                user: req.body.user_sender,
                friends: [],
                invite: [],
                invitation: [req.body.user_host]
            }, function(err, result) {
                nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
        }
    });

    coll.find({
    	user:req.body.user_host
    }).toArray(function(err, docs){
    	if(err){
    		res.json({
                erreur: true
            });
    	}

    	if (docs.length > 0) {
            console.log("update");
            coll.update({
                user: req.body.user_host
            }, {
                $push: {
                    invite: req.body.user_sender
                }
            }, function(err, results) {
                nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
        } else {
            console.log("create");

            coll.insert({
                user: req.body.user_host,
                friends: [],
                invite: [req.body.user_sender],
                invitation: []
            }, function(err, result) {
                nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
        }
    });
});


router.post('/accept-invitation', function(req, res) {
	console.log('/accept-invitation');
	var coll = db.get().collection('friends');
	var nb_fields = 2,
		nb_fields_checked = 0,
		obj_res = {};
    //add invitation to sender friends coll
    coll.find({
        user: req.session.user
    }).toArray(function(err, docs) {
        if (err) {
            console.log('error');
            res.json({
                erreur: true
            });
        }
            console.log("update");
            coll.update({
                user: req.session.user
            }, {
                $push: {
                    friends: req.body.user_host
                },
                $pull: {
                	invite:{ $in: [req.body.user_host] }
                }
            }, function(err, results) {
             	nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
    });

    coll.find({
    	user:req.body.user_host
    }).toArray(function(err, docs){
    	if(err){
    		res.json({
                erreur: true
            });
    	}

            console.log("update");
            coll.update({
                user: req.body.user_host
            }, {
                $push: {
                    friends: req.session.user
                },
                $pull: {
                	invitation:{ $in: [req.session.user] }
                }
            }, function(err, results) {
                nb_fields_checked++;
                tools.wait_for_res(res, nb_fields, nb_fields_checked, obj_res);
            });
	});
});


/* wall */

router.post('/post-msg', function(req, res) {
    console.log('/post-msg');
    var coll = db.get().collection('posts');
    var created_post;
    coll.insert({
        user: req.session.user,
        post: req.body.post,
        comments: [],
        date: new Date(),
    },function(err, records){
    	created_post = records;
	    res.json({
	        post_back: created_post
	    });
    });
});

router.post('/post-comment', function(req, res) {
    console.log('/post-comment');
    var coll = db.get().collection('posts');
    var post_id = new mongodb.ObjectID(req.body._id);
    coll.update({
        _id: post_id
    },{
    	$push:{
    		comments:{ 
    			comment: req.body.comment,
    			date: new Date(),
    			user: req.session.user,
    		}
    	}
    },function(err, records) {
        if (err) throw err;
        res.json({
            comment_back: records
        });
    });
});

router.post('/get-all-posts', function(req, res) {
    console.log('/get-all-posts');
    var last_post_found =  parseInt(req.body.count);
    var wall_type = req.body.wall_type;
    var coll = db.get().collection('posts');
    var user_param = {};
    if(wall_type == "/general-wall"){
    	user_param = {};
    }else if(wall_type == "/personnel-wall"){
    	user_param = {user: req.session.user};
    }else if(wall_type == "/friends-wall"){
    	console.log(req.body.friend_wall);
    	user_param = {user: req.body.friend_wall};
    }

    coll.find(user_param).limit(10).skip(last_post_found).toArray(function(err, docs) {
        res.json({
            posts: docs
        });
    });

});

/* info */
router.get('/get-user-info', function(req, res) {
	console.log("/get-user-info");
	var coll = db.get().collection('user');
	coll.find({user: req.session.user}).toArray(function(err, doc){
		res.json({info: doc[0]});
	});

});


router.post('/set-info', function(req, res){
	console.log('/set-info');
	var coll = db.get().collection('user');
	coll.update({
        user: req.session.user
    }, {
	    "user" : req.body.info.user ,
	    "email" : req.body.info.email ,
	    "address" : req.body.info.address ,
	    "name" : req.body.info.name ,
	    "lastname" : req.body.info.lastname ,
	    "genre" : req.body.info.genre ,
	    "birthday" : req.body.info.birthday ,
	    "pwd" : req.body.info.pwd ,
        
    }, function(err, results) {
    	res.json({ok: true});
    });
});
module.exports = router;