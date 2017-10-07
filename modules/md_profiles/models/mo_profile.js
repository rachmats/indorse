//==== @Author by Rachmat Santosa (rachmat.cad83@gmail.com) 

var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient
var collection = db.get().collection('users');		  		  	
var ObjectId = require('mongodb').ObjectID;
var Data = function (data) {
this.data = data;
}

var Data = function (data) {
this.data = data;
}
//=== Data rows=============
Data.rows = function (req, callback) {	
	 collection.find({}).toArray(function(err, result) {			  
		if (err) return callback(err);					
		callback(null, result);		
	  })		  
};	
//{'email':req.session.user.email}
module.exports = Data;
