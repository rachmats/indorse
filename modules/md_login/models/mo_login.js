var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient
var crypto 		= require('crypto');


var Data = function (data) {
this.data = data;
}
var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

Data.check_process = function (email,password, callback) {

		  var validHash = md5(password).substr(0, 10);	
	
		  var collection = db.get().collection('t_users');

		  collection.find({'email':email,'pass':validHash}).limit(1).toArray(function(err, docs) {
				
				
				if (docs.length > 0 ){
					
					vLogArr = {'user':docs[0].user,'pass':docs[0].pass,'status':true};
					
					callback(null, vLogArr);
				}	else{

					vLogArr = {'status':false};
					
					callback(null, vLogArr);
				}
														
		  });
				
};	


Data.validatePassword = function (plainPass,hashedPass, callback) {

	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass);
	
	var hP =  hashedPass.substr(0, 10);
	var vP =  validHash.substr(0, 10);
	
	var dt = {"hP":hP,vP:vP};
	 
	if (hP === vP){
		callback(null, dt);
	}
	else{
		callback(null, dt);
	}
	
}

module.exports = Data;
