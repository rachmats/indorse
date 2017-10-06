//==== @Author by Rachmat Santosa (rachmat.cad83@gmail.com) :

var express = require('express');
var app = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);

var data = require("../../../modules/md_home/models/mo_home")


exports.index = function(req, res){   
var baseurl = req.url;
var mdl = baseurl.split("/");	
		if(mdl[1] ==''){		
		  res.render('../modules/md_home/views/indexs.html',{module:'Home'});    					 			
		}
		else{		
		  res.render('../modules/md_home/views/index.html',{module:'Home'});    					 			
		}		  
};

exports.menu_modules = function(req, res){
	data.menu_modules(req.param('vPage'), function (err, DataRows) {
		res.send(JSON.stringify(DataRows));
	});    
};
