
(function(){
  var app = angular.module('pipboy',['ngRoute']);

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

  app.config(function($routeProvider){
    $routeProvider
    .when('/',{
       templateUrl : 'template/mur.html',
        controller  : 'wall_post'
      })
    .when('/friends',{
       templateUrl : 'template/friend_list.html',
        controller  : 'wall_post'
      })
    .when('/invite',{
       templateUrl : 'template/inviter.html',
        controller  : 'wall_post'
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
  app.factory('services', function(){
    return{
      get_date_formated: function(date){
        var formated_date = $.dateformatter({
          current_date: date,
          format: 'd/m/Y H:i:s'
        });
        return formated_date;
      },
    };
  });


  app.directive('afterRender', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'A',
        terminal: true,
        transclude: false,
        link: function (scope, element, attrs) {
            $timeout(scope.$eval(attrs.afterRender), 0);  //Calling a scoped method
        }
    };
    return def;
  }]);
/*
  _           _   _                  
 | |         | | | |                 
 | |__  _   _| |_| |_ ___  _ __  ___ 
 | '_ \| | | | __| __/ _ \| '_ \/ __|
 | |_) | |_| | |_| || (_) | | | \__ \
 |_.__/ \__,_|\__|\__\___/|_| |_|___/
                                     
                                     
*/
  app.controller('menu_buttons', function($location){
    this.button_contact = [
      {
        name: 'amis',
        selected: true,
        id: 0,
        url: '/friends',
      },
      {
        name: 'inviter',
        selected: false,
        id: 1,
        url:"/invite"
      },
      {
        name: 'Chat',
        selected: false,
        id: 2,
        url:"/chat"
      },
      {
        name: 'Message',
        selected: false,
        id: 3,
        url: '/message',
      },
    ];
    this.button_mur = [
      {
        name: 'mur',
        selected: true,
        url: '/',
        id: 0,
      },
      {
        name: 'mur',
        selected: true,
        url: '/',
        id: 1,
      },
    ];
    this.button_param = [
      {
        name: 'infos',
        selected: true,
        id: 0,
        url: '/info',
      },
      {
        name: 'deconnexion',
        selected: false,
        id: 1,
        url: '/disconnect',
      },
      {
        name: 'MDP perdu',
        selected: false,
        id: 2,
        url: '/pwdlost',
      },
    ];

    this.set_current_menu_button = function(button_name, index){
        this.current_menu_button = this[button_name];
        console.log("current menu",button_name);
        var val = index || 0;
        console.log(index);
        this.set_current_sub_menu_button(val);
    };

    this.switch_actual_subbutton = function(){
      console.log('new render');
    };
    this.set_current_sub_menu_button = function(index){
        this.current_menu_button.forEach(function(item){
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


  app.controller('wall_post',[ 'services', function(services){
    this.posts = [
      {
        date: new Date(1995,11,17),
        message: 'coucou',
        id: "0",
        user: 'luke Skywalker',
        comments: [
          {
            date: new Date(1995,11,17),
            message: 'Je suis ton père!',
            comment_owner: 'Dark Vador'
          },
          {
            date: new Date(1995,11,17),
            message: 'NNNNNNNOOOOOOOOONNNNNNNNNNN!!!!!',
            comment_owner: 'Luke Skywalker'
          },
        ],
        comment: '',
      },
      {
        date: new Date(),
        message: 'Hola',
        id: "1",
        user: 'lui',

        comment: '',
      },
      {
        date: new Date(2015,1,15),
        message: 'Lok tar',
        id: "2",
        comment: '',
        user:' elle',
      },
    ];
    this.submit_comment =  function(post){
      if(post.comment){
        console.log(post.comment);
        post.comment =  '';
      }
    };

    this.get_date_formated = function(date){
      return services.get_date_formated(date);
    };

  }]);


/*
  _            _ _            
 (_)          (_) |           
  _ _ ____   ___| |_ ___  
 | | '_ \ \ / / | __/ _ \
 | | | | \ V /| | ||  __/
 |_|_| |_|\_/ |_|\__\___|
                              
                              
*/
  app.controller('sn_member', function($http){
    this.members = [];

    this.get_members = function(){
      var self = this;
      $http({
        method: "get",
        url: "/getMembers",
      }).then(function(res){
        self.members = res.data.members;
      }, function(res) {
          console.log('error');
      });
    };

    this.invite_member = function(member){
      $http({
        method: "post",
        url: '/inviteMember',
        data: $.param({user: member}),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res){
        if(res.data.res){
          $.alert({
            title: 'Invitation envoyée',
            body: 'Votre invitation à bien été envoyée.',
            is_delayed: false,
            text_confirm: 'ok',
            extra_class: 'xtra',
            click_outside_for_close: false,
            debug: true,
          });
        }
      }, function(res){
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
  });

/*

[
      {
        name: 'Jabba the Hutt',
        online: true,
        img: "http://www.lightninggamingnews.com/wp-content/uploads/2015/10/Your-Agility-in-Fallout-4-will-make-you-go-ninja-on-enemies-.jpg",
      },
      {
        name: 'Luke Skywalker',
        online: true,
        img: "http://images.techtimes.com/data/images/full/137177/fallout-4-perception.jpg?w=600",
      },
      {
        name: 'Dark Vador',
        online: false,
        img: "http://cdn.pcgamesn.com/sites/default/files/Fallout%204%20perception%20trailer.jpg",
      },
      {
        name: 'Chewbaka',
        online: true,
        img: "http://aggrogamer.com/assets/1444234374-a3f799e812ee21691bc5ecf1e10f2154.jpg",
      },

    ];


       _           _   
      | |         | |  
   ___| |__   __ _| |_ 
  / __| '_ \ / _` | __|
 | (__| | | | (_| | |_ 
  \___|_| |_|\__,_|\__|
                       
                       
*/
  app.controller('chat',[ 'services', function(services){
    this.message = "";
    this.all_message = [
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Marcel',
        date: new Date(),
        message: 'yo',
      },
      {
        user: 'Pouet',
        date: new Date(),
        message: 'miou',
      },
      {
        user: 'LOLO',
        date: new Date(),
        message: 'fdqsd',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      {
        user: 'Maurice',
        date: new Date(),
        message: 'hi',
      },
      
    ];
    this.post_message = function(){
      if(this.message){
        console.log("TODO ad post message");
        this.message = "";
      }
    };

    this.get_date_formated = function(date){
      return services.get_date_formated(date);
    };
  }]);
})();
