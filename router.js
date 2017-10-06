//==== @Author by Rachmat Santosa (rachmat.cad83@gmail.com) :

var session = require('express-session');

// Routes
module.exports = function(app){    

    app.get('/', require('./modules/md_login/controllers/md_login').index);    
            
    //==Ex: http://erp.com/<module_name>/<function>    
	app.get('/*', function (req, res) {
			var baseurl = req.url;
			var mdl = baseurl.split("/");
			var mpath = require('./modules/'+mdl[1]+'/controllers/'+mdl[1]+'.js');        
			mpath[mdl[2]](req, res);
	});
	
	app.post('/*', function (req, res) {
			var baseurl = req.url;
			var mdl = baseurl.split("/");
			var mpath = require('./modules/'+mdl[1]+'/controllers/'+mdl[1]+'.js');        
			mpath[mdl[2]](req, res);

	});
    
};
