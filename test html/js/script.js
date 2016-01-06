'use strict';
(function(){
  var app = angular.module('pipboy',[]);

  app.controller('menu_buttons', function(){
    this.button_contact = [
      {
        name: 'amis',
        selected: true,
        id: 1,
        template: 'template/mur.html',
      },
      {
        name: 'inviter',
        selected: false,
        id: 1,
        template:"template/inviter.html"
      },
      {
        name: 'Chat',
        selected: false,
        id: 2,
        template: 'template/mur.html',
      },
      {
        name: 'Message',
        selected: false,
        id: 3,
        template: 'template/mur.html',
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
        template: 'template/mur.html',
      },
      {
        name: 'deconnexion',
        selected: false,
        id: 2,
        template: 'template/mur.html',
      },
      {
        name: 'MDP perdu',
        selected: false,
        id: 3,
        template: 'template/mur.html',
      },
    ];
    this.current_menu_button = this.button_contact;
    this.template = 'template/mur.html';
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

    this.set_current_template = function(template){
      this.template = template;
       console.log("template",template);
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
  });
})();
