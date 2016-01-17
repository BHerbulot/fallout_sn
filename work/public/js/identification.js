'use strict';
(function(){
  var app = angular.module('connexion',["ngAnimate"]);

  app.controller('identification', function($http, $window){
    this.connexion = 
    {
      name: 'connexion',
      selected: true,
      template: 'template/connexion.html'
    };
    this.forgotten_password = {
        name: 'forgotten_password',
        selected: false,
        template: 'template/forgotten_password.html'
    };
    this.inscription = {
        name: 'inscription',
        selected: false,
        template: 'template/inscription.html'
    };
    
    this.current_panel = this.connexion;
    this.set_current_panel = function(button_name){
      this.current_panel = this[button_name];
    };
/*    this.load_template = function(template){

    };*/

    this.user = {};
    this.submit_form = function(is_valid){
      console.log(this.user);
      if(is_valid){
          $http({
            method: "post",
            url: "login/tryConnection",
            data : $.param(this.user),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(res) {
          //console.log(res);
          if(res.data.res == "error"){
            console.log('erreur');
           }else{
            $window.location.href ='/';
          }
        }, function(res){
          console.log('error');
        });
      }
    };
  });
  
})();
