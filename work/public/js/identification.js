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

});

  app.controller('connect', function($http, $window){
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

  app.controller('inscription', function($http, $window){
    this.msg_error_form = {
        name: '<li>Le Pseudo doit contenir au moins 3 char</li>',
        mail: '<li>L\'adresse mail donné n\'est pas valide</li>',
        mdp: '<li>Le mot de passe doit contenir au moins 6 charactères</li>',
        checked_mdp: '<li>Le mot de passe de vérification n\'est pas identique</li>'
    };

    this.new_user = {};
    this.submit_form = function(is_valid){
      console.log(this.new_user);
     if(is_valid){
        console.log('is_valid');
        if(this.new_user.pwd == this.new_user.checked_pwd){
            console.log('good mdp');
          $http({
            method: "post",
            url: "login/tryInscription",
            data : $.param(this.new_user),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(res) {
          //console.log(res);
          if(res.data.res == "error"){
            console.log('erreur');
          }else if(red.data.bad_form){

          }else{
            console.log(res.data.res);
          }
        }, function(res){
          console.log('error');
        });
      }else{
        this.modal_form_error();
      }
    }else{
        this.modal_form_error();
    }
  };

  this.modal_form_error= function(){
    var msg = '<ul>';
    var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(this.new_user.user === undefined|| this.new_user.user.length < 2 ){
        msg += this.msg_error_form.name;
    }
    if(this.new_user.pwd === undefined||  this.new_user.pwd.length < 5 ){
        msg += this.msg_error_form.mail;
    }
    if( this.new_user.checked_pwd === undefined||   this.new_user.pwd != this.new_user.checked_pwd ){
        msg += this.msg_error_form.mdp;
    }
    if(this.new_user.email === undefined ||  !this.new_user.email.match(pattern)){
        msg += this.msg_error_form.checked_mdp;
    }
    msg += '</ul>';

    var options = {
          title: 'Erreur dans le formulaire',
          body: msg,
          is_delayed: false,
            text_confirm: 'ok',
          extra_class: 'xtra',
          click_outside_for_close: false,
          debug: true,
      };
    $.alert(options);
  };

  this.test_modal = function(){
    var options = {
          title: 'test',
          body: 'test',
          is_delayed: false,
        text_confirm: 'ok',
          text_decline: "null",
          extra_class: 'xtra',
          click_outside_for_close: false,
          debug: true,
      };
    $.alert(options);
  };
});
  
})();
