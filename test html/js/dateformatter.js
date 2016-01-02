(function ($) {
    $.extend({

        dateformatter : function(options) {


            var settings = $.extend({
                current_date:  new Date(),
                locales: "fr-FR"
            }, options);

            var rendered_date = settings.format.replace(/([djlFmnYyGHis])/g, "{{$1}}");

            // Jour  --- ---
            //d Jour du mois, sur deux chiffres (avec un zéro initial)  01 à 31
            rendered_date = rendered_date.replace("{{d}}", this.prefix_int(settings.current_date.getDate()));
            // j Jour du mois sans les zéros initiaux  1 à 31
            rendered_date = rendered_date.replace("{{j}}", settings.current_date.getDate());
            // l ('L' minuscule) Jour de la semaine, textuel, version longue, en français
            rendered_date = rendered_date.replace("{{l}}", this.get_day_name(settings.current_date.getDay(), settings.locales));

            // Mois  --- ---
            // F Mois, textuel, version longue; en français, comme Janvier ou Décembre  Janvier à Décembre
            rendered_date = rendered_date.replace("{{F}}", this.get_month_name(settings.current_date.getMonth(), settings.locales));
            // m Mois au format numérique, avec zéros initiaux 01 à 12
            rendered_date = rendered_date.replace("{{m}}", this.prefix_int(settings.current_date.getMonth() +1));
            // n Mois sans les zéros initiaux  1 à 12
            rendered_date = rendered_date.replace("{{n}}", settings.current_date.getMonth() +1);

            // Année --- ---
            // Y Année sur 4 chiffres  Exemples : 1999 ou 2003
            rendered_date = rendered_date.replace("{{Y}}", settings.current_date.getFullYear());
            // y Année sur 2 chiffres  Exemples : 99 ou 03
            rendered_date = rendered_date.replace("{{y}}", settings.current_date.getFullYear().toString().substring(2));

            // Heure --- ---
            // G Heure, au format 24h, sans les zéros initiaux 0 à 23
            rendered_date = rendered_date.replace("{{G}}", settings.current_date.getHours());
            // H Heure, au format 24h, avec les zéros initiaux 00 à 23
            rendered_date = rendered_date.replace("{{H}}", this.prefix_int(settings.current_date.getHours()));

            // Minutes --- Secondes ---
            // i Minutes avec les zéros initiaux 00 à 59
            rendered_date = rendered_date.replace("{{i}}", this.prefix_int(settings.current_date.getMinutes()));
            // s Secondes, avec zéros initiaux 00 à 59
            rendered_date = rendered_date.replace("{{s}}", this.prefix_int(settings.current_date.getSeconds()));

            return rendered_date;

        },

        prefix_int: function(value){
            if(value < 10){
              value = '0'+value;
            }
            return value;
        },


        get_day_name: function(index, locales){
            var days = [];
            if( locales == "fr-FR" ){
              days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            }
            else if( locales == "en-GB" || locales == "en-US" ){
              days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            }
            else if( locales == "es-ES" ){
              days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
            }

            return days[index];
        },

        get_month_name: function(index, locales){
            var months = [];
            if( locales == "fr-FR" ){
              months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            }
            else if( locales == "en-GB" || locales == "en-US" ){
              months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];
            }
            else if( locales == "es-ES" ){
              months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',];
            }

            return months[index];

        }
    });
})(jQuery);