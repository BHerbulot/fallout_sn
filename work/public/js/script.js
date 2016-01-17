'use strict';
(function(){
  var app = angular.module('pipboy',[]);

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

  app.controller('menu_buttons', function(){
    this.button_contact = [
      {
        name: 'amis',
        selected: true,
        id: 1,
        template: 'template/friend_list.html',
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
        template:"template/chat.html"
      },
      {
        name: 'Message',
        selected: false,
        id: 3,
        template: 'template/mur.html',
      },
    ];
    this.button_mur = [
      {
        name: 'mur',
        selected: true,
        template: 'template/mur.html',
        id: 1,
      },
      {
        name: 'mur',
        selected: true,
        template: 'template/mur.html',
        id: 1,
      },
    ];
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
    this.template = "template/chat.html";
    this.set_current_menu_button = function(button_name){
        this.current_menu_button = this[button_name];
        console.log("current menu",button_name);
        this.set_current_sub_menu_button(0);
    };
    this.set_current_sub_menu_button = function(index){
        this.current_menu_button.forEach(function(item){
          item.selected = false;
        });
        this.current_menu_button[index].selected = true;
        this.set_current_template(this.current_menu_button[index].template);
    };

    this.set_current_template = function(template){
      this.template = template;
       console.log("template",template);
    };
    
  });

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
