(function() {
    var app = angular.module('connexion', ["ngAnimate"]);

    app.controller('identification', function() {
        this.connexion = {
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
        this.set_current_panel = function(button_name) {
            this.current_panel = this[button_name];
        };
        /*    this.load_template = function(template){

};*/

    });

    app.controller('connect',[ 'services','$http', '$window', function(services, $http, $window) {
        this.user = {};
        this.submit_form = function(is_valid) {
            console.log(this.user);
            if (is_valid) {
                $http({
                    method: "post",
                    url: "login/tryConnection",
                    data: $.param(this.user), // pass in data as strings
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(res) {
                    //console.log(res);
                    if (res.data.res == "error") {
                        console.log('erreur');
                    } else {
                        $window.location.href = '/';
                    }
                }, function(res) {
                    console.log('error');
                });
            }else{
                services.modal_form_error(this.user);
    }
        };
    }]);

    app.controller('inscription',['services', '$http','$window', function(services, $http, $window) {
        

        this.new_user = {};
        this.submit_form = function(is_valid) {
            console.log(this.new_user);
            if (is_valid) {
                console.log('is_valid');
                if (this.new_user.pwd == this.new_user.checked_pwd) {
                    console.log('good pwd');
                    $http({
                        method: "post",
                        url: "login/tryInscription",
                        data: $.param(this.new_user), // pass in data as strings
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(res) {
                        var options = {
                            title: 'Erreur dans le formulaire',
                            body: '<ul><li>Ce pseudo est déjà attribué.</li></ul>',
                            is_delayed: false,
                            text_confirm: 'ok',
                            extra_class: 'xtra',
                            click_outside_for_close: false,
                            debug: true,
                        };
                        //console.log(res);
                        if (res.data.res == "error") {
                            console.log('erreur');
                        }else if(res.data.res == "ok"){
                             $window.location.href = '/';
                        } else if (res.data.bad_form) {
                            options.body = "Formulaire invalide et comme tu as triché en désactivant la vérification coté js je ne peux pas te dire ou est ton erreur, ou putôt j'ai pas envie de le faire.";
                            $.alert(options);
                        } else if (res.data.user_already_exist) {
                            options.body = '<ul><li>Ce pseudo est déjà attribué.</li></ul>';
                            $.alert(options);
                        } else {
                            console.log(res.data.res);
                        }
                    }, function(res) {
                        console.log('error');
                    });
                } else {
                    services.modal_form_error(this.new_user);
                }
            } else {
                services.modal_form_error(this.new_user);
            }
        };


    }]);
    app.factory('services',  function(){
        return{
            modal_form_error: function(infos) {
                var msg_error_form = {
                    name: '<li>Le Pseudo doit contenir au moins 3 char</li>',
                    mail: '<li>L\'adresse mail donné n\'est pas valide</li>',
                    pwd: '<li>Le mot de passe doit contenir au moins 6 charactères</li>',
                    checked_pwd: '<li>Le mot de passe de vérification n\'est pas identique</li>'
                };
                var msg = '<ul>';
                var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (infos.user === undefined || infos.user.length < 2) {
                    msg += msg_error_form.name;
                }
                if (infos.pwd === undefined || infos.pwd.length < 5) {
                    msg += msg_error_form.pwd;
                }
                if (infos.checked_pwd === undefined || infos.pwd != infos.checked_pwd) {
                    msg += msg_error_form.checked_pwd;
                }
                if (infos.email === undefined || !infos.email.match(pattern)) {
                    msg += msg_error_form.email;
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
            },
        };
    });    

})();