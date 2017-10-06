//==== @Author by Rachmat Santosa (rachmat.cad83@gmail.com) 
//==== @Created On  : 2017-08-25

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
//=== Data List=============
Data.datalist = function (find,limit,skip, callback) {	
	var vData = [];
	 collection.find(find).limit(limit).skip(skip).toArray(function(err, result) {			  
		if (err) return callback(err);					
		callback(null, result);					
	  })		  	  
};	
//=== Total Rows=============
Data.countrows = function (find, callback) {	
	  collection.count(find, function(err, result) {	
			if (err) return callback(err);					
			callback(null, result);			
	  });		  			
}

module.exports = Data;
