var data = require("../../../modules/md_login/models/mo_login")
var jwt    = require('jsonwebtoken');
var passwordHash = require('password-hash');
var randtoken = require('rand-token');
var crypto = require('crypto');
var Config = require('config-js');
var config = new Config('./config/cfg.js');
var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
var express = require('express') // call express
var app = express(); // create an instance of an express app
var expressJwt = require('express-jwt');	  		  	
var session = require('client-sessions');
var bodyParser = require('body-parser');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}


exports.index = function(req, res){


    res.pageInfo = {};
    res.pageInfo.title = 'Login';
	res.render('../modules/md_login/views/vw_login.html');    
    
};

app.set('jwtSecret', 'bsdfhg%$#^%$')
//config.set('jwtTokenLifetimeInMinutes',0.5)

exports.process = function(req,res){

    var info = req.body;
	if(req.param('email') != ''  && req.param('password') != '')
    {
        email = req.param('email');
        password = req.param('password');
		db.get().collection('users',function(err,collection){
		    collection.findOne({'email': email}, function(err, item) {
                if(item)
                {
            if('approved' in item && item['approved'])
            {
			salt = item['salt'];
			storedpass = item['pass'];
			var passwordData = sha512(password, salt);
			
			if(passwordData.passwordHash == storedpass)
			{
				req.session.user = item;
								
                var user_item = Object.assign({},item);
                delete user_item['pass'];
                delete user_item['salt'];
                delete user_item['tokens'];
                
			   // var token = jwt.sign(user_item,app.get('jwtsecret'), {
               //                         expiresIn : 60*60*24*31 // expires in 31 days
               // });
                if(!('tokens' in item))
                {
                    item['tokens'] = [];
                }
                //item['tokens'].push(token);
                collection.update({'email' : email},item,{safe:true}, function(err, result) {
                    if (err) {
                        res.send(200,{ success : false, message : config.get('Msg200')});
                    } else {
                        res.send(200,{ success : true, message : config.get('Msg200'), 
							//token : token
							});
                    }
                });
			}
			else
			{
				res.send(200,{ success : false, message : config.get('Msg200') });
			}
        }
        else
        {
            res.send(404,{ success : false, message : config.get('Msg404') });
        }
		}
		else
		{
			 res.send(404,{ success : false, message : config.get('Msg404') });
		}
		})
		})
	}
	else
	{
		res.send(422,{ success : false, message : config.get('Msg422') });
	}
	
	
}
