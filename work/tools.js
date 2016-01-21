module.exports = {
	form_verification: function (fields) {
		var checked_fields = [];
		fields.forEach(function(el){
			switch(el.type){
				case "name":
					el.type = el.content.length > 2;
					break;
				case "pwd":
					el.type = el.content.length > 5;
					break;
				case "checked_pwd":
					el.type = el.content == el.pwd;
					break;
				case "email":
					var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
					el.type = el.content.match(pattern) ? true : false;  
					break;
				default:
					console.log('error');
			}
			checked_fields.push(el);
		});
		return checked_fields;
	},
};