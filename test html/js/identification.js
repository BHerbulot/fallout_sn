'use strict';
(function(){
  var app = angular.module('connexion',["ngAnimate"]);

  app.controller('identification', function(){
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
    
    this.current_panel = this.inscription;
    this.set_current_panel = function(button_name){
      this.current_panel = this[button_name];
    };
/*    this.load_template = function(template){

    };*/

    this.submit_form = function(is_valid){
      if(is_valid){
        alert('cool');
      }
    };
  });
  
})();
