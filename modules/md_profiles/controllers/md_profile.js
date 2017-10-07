var nodemailer = require("nodemailer");
var Config = require('config-js');
var config = new Config('./config/cfg.js');
var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var collection = db.get().collection('users');		  		  	
var vmodule = "profile";
var vtitle = "My Profile";
var data = require("../../../modules/md_"+vmodule+"/models/mo_"+vmodule)

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "ssl://smtp.googlemail.com",
    port:465,
    auth: {
        user: "rachmattest@gmail.com",
        pass: "P455w0rd"        
    }
    
});
exports.index = function(req, res){		
	res.render('../modules/md_home/views/index.html',{module:'profile',fnmodule:req.param('m'),id:req.param('id')});    					 				   	
};

exports.create = function(req, res){	
	res.render("../modules/md_"+vmodule+"/views/add_"+vmodule+".html",{title:vtitle});    	
};

exports.data = function(req, res){
	data.rows(req, function (err, results) {
	res.render("../modules/md_"+vmodule+"/views/vw_"+vmodule+".html",{title:vtitle,'results':results});
	});    
};


