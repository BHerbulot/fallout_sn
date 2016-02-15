(function() {
    var app = angular.module('pipboy', ['ngRoute', 'autocomplete']);

    /*
                   __ _       
                  / _(_)      
   ___ ___  _ __ | |_ _  __ _ 
  / __/ _ \| '_ \|  _| |/ _` |
 | (_| (_) | | | | | | | (_| |
  \___\___/|_| |_|_| |_|\__, |
                         __/ |
                        |___/ 
  */

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'template/mur.html',
                controller: 'wall_post'
            })
            .when('/friends', {
                templateUrl: 'template/friend_list.html',
                controller: 'wall_post'
            })
            .when('/invite', {
                templateUrl: 'template/inviter.html',
                controller: 'wall_post'
            })
            .when('/personnel-wall', {
                templateUrl: 'template/mur.html',
                controller: 'wall_post'
            })
            .when('/general-wall', {
                templateUrl: 'template/mur.html',
                controller: 'wall_post'
            })
            .when('/friends-wall/:user_name', {
                templateUrl: 'template/mur.html',
                controller: 'wall_post'
            })
            .when('/user-info', {
                templateUrl: 'template/info.html',
                controller: 'wall_post'
            })
            .when('/disconnect', {
                templateUrl: 'template/disconnect.html',
                controller: 'wall_post'
            });
    });
    /*
                      _               
                     (_)              
  ___  ___ _ ____   ___  ___ ___  ___ 
 / __|/ _ \ '__\ \ / / |/ __/ _ \/ __|
 \__ \  __/ |   \ V /| | (_|  __/\__ \
 |___/\___|_|    \_/ |_|\___\___||___/
                                      
                                      
*/
    app.factory('services', function($http) {
        return {
            get_date_formated: function(date) {
                var formated_date = $.dateformatter({
                    current_date: date,
                    format: 'd/m/Y H:i:s'
                });
                return formated_date;
            },

            get_current_user: function() {
                var self = this;
                if (!this.current_user) {
                    $http({
                        method: "get",
                        url: "/getCurrentUser",
                    }).then(function(res) {
                        self.current_user = res.data.user;
                        console.log(res.data.user);
                        //return res.data.user;
                    }, function(res) {
                        console.log('error');
                    });
                } else {
                    return self.current_user;
                }
                return self.current_user;
            },

            current_user: null,
        };
    });


    app.directive('afterRender', ['$timeout',
        function($timeout) {
            var def = {
                restrict: 'A',
                terminal: true,
                transclude: false,
                link: function(scope, element, attrs) {
                    $timeout(scope.$eval(attrs.afterRender), 0); //Calling a scoped method
                }
            };
            return def;
        }
    ]);
    /*
  _           _   _                  
 | |         | | | |                 
 | |__  _   _| |_| |_ ___  _ __  ___ 
 | '_ \| | | | __| __/ _ \| '_ \/ __|
 | |_) | |_| | |_| || (_) | | | \__ \
 |_.__/ \__,_|\__|\__\___/|_| |_|___/
                                     
                                     
*/
    app.controller('menu_buttons', function($location) {
        this.button_contact = [{
            name: 'amis',
            selected: true,
            id: 0,
            url: '/friends',
        }, {
            name: 'inviter',
            selected: false,
            id: 1,
            url: "/invite"
        }, {
            name: 'Chat',
            selected: false,
            id: 2,
            url: "/chat"
        }, {
            name: 'Message',
            selected: false,
            id: 3,
            url: '/message',
        }, ];
        this.button_mur = [{
            name: 'general',
            selected: true,
            url: '/general-wall',
            id: 0,
        }, {
            name: 'personnel',
            selected: false,
            url: '/personnel-wall',
            id: 1,
        }, ];
        this.button_param = [{
            name: 'infos',
            selected: true,
            id: 0,
            url: '/user-info',
        }, {
            name: 'deconnexion',
            selected: false,
            id: 1,
            url: '/disconnect',
        }, {
            name: 'MDP perdu',
            selected: false,
            id: 2,
            url: '/pwdlost',
        }, ];

        this.set_current_menu_button = function(button_name, index) {
            this.current_menu_button = this[button_name];
            var val = index || 0;
            this.set_current_sub_menu_button(val);
        };

        this.switch_actual_subbutton = function() {
            console.log('new render');
        };
        this.set_current_sub_menu_button = function(index) {
            this.current_menu_button.forEach(function(item) {
                item.selected = false;
            });
            this.current_menu_button[index].selected = true;
            $location.url(this.current_menu_button[index].url);
        };
    });
    /*
                _ _ 
               | | |
 __      ____ _| | |
 \ \ /\ / / _` | | |
  \ V  V / (_| | | |
   \_/\_/ \__,_|_|_|                          
*/


    app.controller('wall_post', ['services', '$http', '$location', "$routeParams",
        function(services, $http, $location, $routeParams) {
            this.posts = [];
            this.post_msg  = "";
            this.post_back = [];
            this.post_count = 0;
            this.wall_type = null; //determine sir on est dans le mur generale, locale ou d'un amis
            this.friend_wall = null;


            this.get_post = function(){
                var self = this;
                    $http({
                        method: "post",
                        url: "/get-all-posts",
                        data: $.param({
                            count: self.post_count,
                            wall_type: self.wall_type,
                            friend_wall: self.friend_wall,
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(res) {
                        _.each(res.data.posts,function(post){

                            self.posts.push(post);
                        });
                        if(res.data.posts.length > 9 ){
                            self.post_count +=10;
                        }else{
                            $('.ask-more-post').remove();
                        }


                    }, function(res) {
                        console.log('error');
                    });
            };
            this.scroll_bot = function(){
                setTimeout(function(){
                  $('.post-container').scrollTop($('.post-container').prop('scrollHeight'));
            },50);

            };

            this.submit_comment = function(post) {
                if (post.comment) {
                    $http({
                        method: "post",
                        url: "/post-comment",
                        data: $.param({
                            user: post.user,
                            comment: post.comment,
                            _id: post._id,
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(res) {
                         post.comments.push({
                            comment: post.comment,
                            user: window.user,
                            date: new Date(),
                        });
                        post.comment = '';
                    }, function(res) {
                        console.log('error');
                    });
                }
            };

            this.initialize = function(){
                this.wall_type = $location.$$path;

                if($routeParams.user_name){
                    this.friend_wall = $routeParams.user_name;
                    this.wall_type = "/friends-wall";

                }
                if (!window.user) {
                    $http({
                        method: "get",
                        url: "/getCurrentUser",
                    }).then(function(res) {
                        window.user = res.data.user;
                        //return res.data.user;
                    }, function(res) {
                        console.log('error');
                    });
                }
                this.get_post();
            };

            this.submit_msg = function(post){
                var self = this;
                if(post.msg){
                    $http({
                        method: "post",
                        url: "/post-msg",
                        data: $.param({
                            post: post.msg
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(res) {
                        self.post_back.push(res.data.post_back.ops[0]);
                        self.scroll_bot();
                    }, function(res) {
                        console.log('error');
                    });
                    post.msg = "";
                }
            };

            this.get_date_formated = function(date) {
                return services.get_date_formated(new Date(date));
            };

            this.tpl = "template/post_back.html";
        }
    ]);



    /*
  _            _ _            
 (_)          (_) |           
  _ _ ____   ___| |_ ___  
 | | '_ \ \ / / | __/ _ \
 | | | | \ V /| | ||  __/
 |_|_| |_|\_/ |_|\__\___|
                              
                              
*/
    app.controller('sn_member', ['services', '$http',
        function(services, $http) {
            this.members = [];
            this.members_names = [];
            this.friends = [];
            this.invite = [];
            this.invitation = [];
            this.user = null;

            this.get_members = function() {
                var self = this;
                $http({
                    method: "get",
                    url: "/getFriends",
                    data: $.param({
                        user_sender: services.get_current_user()
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(res) {
                    if(!res.data.no_friends){
                        if(res.data.hasOwnProperty('friends')){
                            self.friends = res.data.friends;
                        }
                        if(res.data.hasOwnProperty('invites')){
                            self.invite = res.data.invites;
                        }
                        if(res.data.hasOwnProperty('invitations')){
                            self.invitation = res.data.invitations;
                        }
                    }
                    $http({
                        method: "get",
                        url: "/getMembers",
                    }).then(function(res) {
                        self.members = res.data.members;
                        self.user = res.data.user;
                        var self2 = self;
                        self.update_members();
                    }, function(res) {
                        console.log('error');
                    });

                }, function(res) {
                    console.log('error');
                });
            };

            this.update_members = function(){
                var self = this;
                var commporator = [this.friends, this.invite, this.invitation ];
                for (var i = 0 ; i < commporator.length; i++) {
                    for (var k = 0; k < commporator[i].length; k++) {
                        for (var j = 0; j < this.members.length; j++) {
                            if(commporator[i] !== undefined && commporator[i].length > 0){
                                if(commporator[i][k].user == this.members[j].user){
                                    this.members.splice(j, 1);
                                }
                            }
                        }
                    }
                    
                }
                _.each(this.members, function(member){
                    self.members_names.push(member.user);
                });
                var index = this.members_names.indexOf(this.user);
                this.members_names.splice(index,1);
                console.log(self.members_names);
            };

            this.invite_member = function(member) {
                var self = this;
                $http({
                    method: "post",
                    url: '/inviteMember',
                    data: $.param({
                        user_host: member,
                        user_sender: this.user
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(res) {
                    if (res.data.res) {
                        $.alert({
                            title: 'Invitation envoyée',
                            body: 'Votre invitation à bien été envoyée.',
                            is_delayed: false,
                            text_confirm: 'ok',
                            extra_class: 'xtra',
                            click_outside_for_close: false,
                            debug: true,
                        });
                        self.get_members();
                    }
                }, function(res) {
                    $.alert({
                        title: 'Erreur serveur',
                        body: 'Votre invitation n\'a pas put être envoyée',
                        is_delayed: false,
                        text_confirm: 'ok',
                        extra_class: 'xtra',
                        click_outside_for_close: false,
                        debug: true,
                    });
                });
            };
        }
    ]);
/*
  ______ _____  _____ ______ _   _ _____   _____ 
 |  ____|  __ \|_   _|  ____| \ | |  __ \ / ____|
 | |__  | |__) | | | | |__  |  \| | |  | | (___  
 |  __| |  _  /  | | |  __| | . ` | |  | |\___ \ 
 | |    | | \ \ _| |_| |____| |\  | |__| |____) |
 |_|    |_|  \_\_____|______|_| \_|_____/|_____/ 
                                                 
                                                 
*/
    app.controller('sn_friends', ['services', '$http',
        function(services, $http) {

            this.friends = [];
            this.invite = [];
            this.invitation = [];
            this.simple_avatar = "/img/avatar.png";

            this.get_friends = function(){
                var self = this;
                $http({
                    method: "get",
                    url: "/getFriends",
                    data: $.param({
                        user_sender: services.get_current_user()
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(res) {
                    //self.simple_avatar = res.data.simple_avatar;
                    console.log(res.data);
                    if(res.data.hasOwnProperty('friends')){
                        self.friends = res.data.friends;
                        _.each(self.friends, function(elem){
                            elem.state = 'friends';
                        });
                    }
                    if(res.data.hasOwnProperty('invites')){
                        self.invites = res.data.invites;
                        _.each(self.invites, function(elem){
                            elem.state = 'invites';
                        });
                    }
                    if(res.data.hasOwnProperty('invitations')){
                        self.invitations = res.data.invitations;
                        _.each(self.invitations, function(elem){
                            elem.state = 'invitations';
                        });
                    }
                    self.all = [];
                    if(self.friends !== undefined){
                        self.all = self.all.concat(self.friends);
                    }
                    if(self.invites !== undefined){
                        self.all = self.all.concat(self.invites);
                    }
                    if(self.invitations !== undefined){
                        self.all = self.all.concat(self.invitations);
                    }
                    console.log(self.all);
                });
            };

            this.accept_invitation = function($event,member){
                var self = this;

                $http({
                    method: "post",
                    url: '/accept-invitation',
                    data: $.param({
                        user_host: member,
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(res) {
                    $($event.target).parents('.member_box').remove();
                        self.get_friends();
                }, function(res) {
                    $.alert({
                        title: 'Erreur serveur',
                        body: 'Votre invitation n\'a pas put être envoyée',
                        is_delayed: false,
                        text_confirm: 'ok',
                        extra_class: 'xtra',
                        click_outside_for_close: false,
                        debug: true,
                    });
                });
            };
        }
    ]);

/*
  _        __      
 (_)      / _|     
  _ _ __ | |_ ___  
 | | '_ \|  _/ _ \ 
 | | | | | || (_) |
 |_|_| |_|_| \___/ 
                   
                   
*/
 app.controller('user_info', ['services', '$http',
    function(services, $http) {
        this.info = null;

        this.get_info = function(){
            var self = this;
            $http({
                method: "get",
                url: '/get-user-info',
            }).then(function(res) {
                console.log(res);
                self.info = res.data.info;
                console.log(self.info);
            }, function(res) {
                console.log('error');
            });
        };

        this.set_info = function(){
            var self = this;
            $http({
                method: "post",
                url: '/set-info',
                data: $.param({
                    info: self.info,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(res) {
                    console.log('here');
            }, function(res) {
                $.alert({
                    title: 'Erreur serveur',
                    body: 'Votre invitation n\'a pas put être envoyée',
                    is_delayed: false,
                    text_confirm: 'ok',
                    extra_class: 'xtra',
                    click_outside_for_close: false,
                    debug: true,
                });
            });
        };
    }
]);

    /*
       _           _   
      | |         | |  
   ___| |__   __ _| |_ 
  / __| '_ \ / _` | __|
 | (__| | | | (_| | |_ 
  \___|_| |_|\__,_|\__|
                       
                       
*/
    app.controller('chat', ['services',
        function(services) {
            this.message = "";
            this.all_message = [{
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Marcel',
                    date: new Date(),
                    message: 'yo',
                }, {
                    user: 'Pouet',
                    date: new Date(),
                    message: 'miou',
                }, {
                    user: 'LOLO',
                    date: new Date(),
                    message: 'fdqsd',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                }, {
                    user: 'Maurice',
                    date: new Date(),
                    message: 'hi',
                },

            ];
            this.post_message = function() {
                if (this.message) {
                    console.log("TODO ad post message");
                    this.message = "";
                }
            };

            this.get_date_formated = function(date) {
                return services.get_date_formated(date);
            };
        }
    ]);

/*
      _                
     | |               
   __| | ___  ___ ___  
  / _` |/ _ \/ __/ _ \ 
 | (_| |  __/ (_| (_) |
  \__,_|\___|\___\___/ 
                       
                       
*/

    app.controller('disco',['services', '$http', '$window',
        function(services, $http, $window) {
        this.on_disconnect = function(){
            //a href="/disconnect" style="position: absolute; top: 0; left: 0;">Déconnexion</a>
            var self = this;
            $.alert({
                title: 'Déconnexion',
                body: 'Souahaitez vous vous déconnecter?',
                is_delayed: false,
                text_confirm: 'oui',
                text_decline: 'non',
                extra_class: 'xtra',
                click_outside_for_close: false,
                callback_confirm: self.bye,
                debug: true,
            });
        };

        this.bye = function(){
            
            var self = this;
            $http({
                method: "get",
                url: '/disconnect',
            }).then(function(res) {
                    console.log('here');
                    $window.location.href = '/login';
            }, function(res) {
                $.alert({
                    title: 'Erreur serveur',
                    is_delayed: false,
                    text_confirm: 'ok',
                    extra_class: 'xtra',
                    click_outside_for_close: false,
                    debug: true,
                });
            });
        };
    }]);   
})();