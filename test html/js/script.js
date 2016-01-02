'use strict';
(function(){
  var app = angular.module('pipboy',[]);

  app.controller('menu_buttons', function(){
    this.button_contact = [
      {
        name: 'list',
        selected: true,
        id: 1,
      },
      {
        name: 'Chat',
        selected: false,
        id: 2,
      },
      {
        name: 'Message',
        selected: false,
        id: 3,
      },
    ];
    this.button_mur = {
      name: 'mur',
      selected: true,
      template: 'template/mur.html',
      id: 1,
    };
    this.button_param = [
      {
        name: 'test',
        selected: true,
        id: 1,
      },
      {
        name: 'deconnexion',
        selected: false,
        id: 2,
      },
      {
        name: 'MDP perdu',
        selected: false,
        id: 3,
      },
    ];
    this.current_menu_button = this.button_contact;
    this.set_current_menu_button = function(button_name){
        this.current_menu_button = this[button_name];
        console.log("current menu",button_name);
    };
    this.set_current_sub_menu_button = function(index){
        this.current_menu_button.forEach(function(item){
          item.selected = false;
        });
         this.current_menu_button[index].selected = true;
    };
    this.template = {
      name: 'mur.html',
      url: 'template/mur.html'
    };
  });

  app.controller('wall_post', function(){
    this.posts = [
      {
        date: new Date(1995,11,17),
        message: 'coucou',
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
        ]
      },
      {
        date: new Date(),
        message: 'Hola'
      },
      {
        date: new Date(2015,1,15),
        message: 'Lok tar'
      },
    ];

    this.get_date_formated =  function(date){
      var formated_date = $.dateformatter({
        current_date: date,
        format: 'd/m/Y H:i:s'
      });

      return formated_date;
    };
  });

  app.controller('sn_member', function(){
    this.members = [
      {
        name: 'Jabba the Hutt',
        online: true,
        friend: false,
      },
      {
        name: 'Luke Skywalker',
        online: true,
        friend: true,
      },
      {
        name: 'Dark Vador',
        online: false,
        friend: true,
      },
      {
        name: 'Chewbaka',
        online: true,
        friend: false,
      },

    ];
  });
})();
