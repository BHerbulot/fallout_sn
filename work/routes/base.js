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
        var doc = docs[0] === undefined ? {} : docs[0];
        if (doc.friends.length === 0 && doc.invite.length === 0 && doc.invitation.length === 0) {
            console.log('pas d\'amis');
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
                member_coll.find({
                    user: {
                        $in: doc.invite
                    }
                }).toArray(function(err, result) {
                    obj_res.friends = result;
                    fields_checked++;
                    tools.wait_for_res(res, fields_target, fields_checked, obj_res);
                });
            } else {
                fields_checked++;
                tools.wait_for_res(res, fields_target, fields_checked, obj_res);
            }
            if (doc.invitation.length !== 0) {
                member_coll.find({
                    user: {
                        $in: doc.invitation
                    }
                }).toArray(function(err, result) {
                    obj_res.friends = result;
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

module.exports = router;