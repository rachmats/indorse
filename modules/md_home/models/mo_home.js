var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient

var Data = function (data) {
this.data = data;
}
			
Data.menu_modules = function (findedArray, callback) {
	
		  var collection = db.get().collection('t_modules');		  		  
		 collection.find().toArray(function(err, docs) {			  
					if (err) return callback(err);					
					callback(null, docs);			
		  })
		  
};	


module.exports = Data;
