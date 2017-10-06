var data = require("../../../modules/md_users/models/mo_users")
var jwt    = require('jsonwebtoken');
//var passwordHash = require('password-hash');
var randtoken = require('rand-token');
var crypto = require('crypto');
var nodemailer = require("nodemailer");
var Config = require('config-js');
var config = new Config('./config/cfg.js');
var db = require('../../../config/database')
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var collection = db.get().collection('users');		  		  	
var baseurl = 'http://45.112.125.25:5000/md_users/';
var vmodule = "users";
var vtitle = "Users";
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
	res.render('../modules/md_home/views/index.html',{module:'users',fnmodule:req.param('m'),id:req.param('id')});    					 				   	
};

exports.data = function(req, res){	
	res.render("../modules/md_"+vmodule+"/views/vw_"+vmodule+".html",{title:vtitle});    	
};

exports.signup = function(req, res){		
    res.pageInfo = {};
    res.pageInfo.title = 'Signup';
	res.render('../modules/md_users/views/vw_signup.html');        
};

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
function fnSender(email,subject,message){	
    var mailOptions={		
        to : email,
        subject : subject,
        text : message
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
     }else{
            console.log("Message sent: " + response.message);
         }
	});
};


exports.process = function(req, res){

	var info = req.body;
	if('password' in info && info['password'] != '' && 'name' in info && info['name'] != '')
	{
		var email = info['email'];
		var name = info['name'];
		var password = info['password'];
		var passwordData = saltHashPassword(password);
		var salt =  passwordData.salt;
		var hashedPassword = passwordData.passwordHash;

		db.get().collection('users',function(err,collection){
        		info['timestamp'] = Math.floor(Date.now() / 1000);
		        collection.findOne({'email': info['email']}, function(err, item) {
        		if(item)
        		{
				res.send(200,{ success : false, message : "success"  });
			}
			else
			{
				info['pass'] =  hashedPassword;
				info['salt'] = salt;
				info['verify_token'] = randtoken.generate(16);
                info['ga_id'] = randtoken.generate(16);
				delete info['password'];
				collection.insert(info, {safe:true}, function(err,result){
                		if(err){
                		}
                		else
                		{	
                                	    var msg_text = "Dear " + name + ", <br><br> Thank you for signing-up at Indorse.io.  Welcome to the Indorse community.  For the purposes of verification, we request you to click on the following link to verify your email address: <br><br> <a href='" + baseurl + "verify/?email=" + email + "&verify_token=" + info['verify_token'] + "'>Verification link</a> <br><br> If you have not signed-up on Indorse.io, we request you to kindly ignore this email.  We apologise for the inconvenience this may have caused you. <br><br> Thank you and regards <br> Team Indorse <br><br> Please let us know if you have any problems or questions at: <br> www.indorse.io";
                                        var sub_text = 'Your email verification link from Indorse';
                                        var to_obj = {};
                                        to_obj[email] = name;
                                        var data = {
                                          from: 'Indorse <info@indorse.io>',
                                          to: email,
                                          subject: sub_text,
                                          html: msg_text
                                        };
                                        
										fnSender(email,sub_text,msg_text)						
                                        //mailgun.messages().send(data, function (error, response) {
                                        //sendinObj.send_email({"to" : to_obj,"from" : ["info@indorse.io","Indorse"],"text" : msg_text,"subject" : sub_text}, function(err, response){
                                        //res.send({success : true,message : "success send your email verification"})
                                        /*if(response.code != 'success')
                                        {
                                                res.send(501,{ success : false, message : config.get('Msg2') });
                                        }
                                        else
                                        {
                                                res.send({success : true,message : config.get('Msg3')})
                                        }*/
                                        //});
							res.send(JSON.stringify({ message: 'Success' }));			
                		}
                		})
			}
			})
		})	
	}
	else
	{
		res.send(422,{ success : false, message : "error" });
	}
   
}


exports.resendVerification = function(req,res){

    var info = req.body;
    if('email' in info && info['email'] != '')
    {
        var email = info['email'];
                    db.get().collection('users',function(err,collection){
                            info['timestamp'] = Math.floor(Date.now() / 1000);
                            collection.findOne({'email': info['email']}, function(err, item) {
                            if(item)
                            {
                                    if(!('verified' in item) || !item['verified'])
                                    {
                                        if(!('verify_token' in item))
                                        {
                                            //insert if not available. But logically verify token should be present since user is created but verification is not done
                                        }
                                        var msg_text = "Dear " + item['name'] + ", <br><br> Thank you for signing-up at Indorse.io.  Welcome to the Indorse community.  For the purposes of verification, we request you to click on the following link to verify your email address: <br><br> <a href='" + baseurl   + "verify-email?email=" + item['email'] + "&token=" + item['verify_token'] + "'>Verification link</a> <br><br> If you have not signed-up on Indorse.io, we request you to kindly ignore this email.  We apologise for the inconvenience this may have caused you. <br><br> Thank you and regards <br> Team Indorse <br><br> Please let us know if you have any problems or questions at: <br> www.indorse.io";
                                        var sub_text = 'Your email verification link from Indorse';
                                        var to_obj = {};
                                        to_obj[item['email']] = item['name'];
                                        //sendinObj.send_email({"to" : to_obj,"from" : ["info@indorse.io","Indorse"],"text" : msg_text,"subject" : sub_text}, function(err, response){
                                        var data = {
                                          from: 'Indorse <info@app.indorse.io>',
                                          to: item['email'],
                                          subject: sub_text,
                                          html: msg_text
                                        };
                                        
										fnSender(email,sub_text,msg_text)						
                                        //mailgun.messages().send(data, function (error, response) {
                                        //res.send({success : true,message : config.get('Msg3')})
                                        /*if(response.code != 'success')
                                        {
                                                res.send(501,{ success : false, message : config.get('Msg2') });
                                        }
                                        else
                                        {
                                                res.send({success : true,message : config.get('Msg3')})
                                        }*/
                                        //});
										res.send(JSON.stringify({ message: 'Success' }));			
                                        
                                    }
                                    else
                                    {
                                        res.send(501,{ success : false, message : config.get('Msg501') });
                                    }
                            }
                            else
                            {
                                res.send(501,{ success : false, message : config.get('Msg501') });
                            }
                        })
                    })
    }
    else
    {
        res.send(501,{ success : false, message : config.get('Msg501') });
    }
}
exports.verify = function(req,res){
     
	
    if(req.param('email') != ''  && req.param('verify_token') != '')
    {
		db.get().collection('users',function(err,collection){
		    collection.findOne({'email': req.param('email'),'verify_token':req.param('verify_token')}, function(err, item) {
                        if(item)
                        {	
				delete item['verify_token'];
				item['verified'] = true;
				var user_item = Object.assign({},item);
				delete user_item['pass'];
				delete user_item['salt'];
				delete  ['tokens'];
				//var token = jwt.sign(user_item,config.get('jwtsecret'), {
                //                       expiresIn : 60*60*24*31 // expires in 31 days
                //                });
				if(!('tokens' in item))
                {
                    item['tokens'] = [];
                }
                //item['tokens'].push(token);
				collection.update({'email' : req.param('email')},item,{safe:true}, function(err, result) {
				if (err) {
                                	    res.send(501,{ success : false, message : config.get('Msg501') });
				} else {

                    name = item['name']
                    email = item['email']
                    //var msg_text = "Hello here is the forgot passsword link https://indorse-staging.herokuapp.com/password/reset?email=" + email + "&pass_token=" + pass_verify_token;
                    var msg_text = "Dear " + name + ", <br><br> Thank you for confirming your email address. As next steps, our team will quickly verify your registration request and will attempt to approve your login details at the earliest.  We will send you an email as soon as your login details are approved: <br><br> We look forward to your participation onto our platform.<br><br> Thank you and regards <br> Team Indorse <br><br> Please let us know if you have any problems or questions at: <br> www.indorse.io";
                    var sub_text = 'Your email verified';
                    var to_obj = {};
                    to_obj[email] = name;
                    var data = {
                            from: 'Indorse <info@app.indorse.io>',
                            to: item['email'],
                            subject: sub_text,
                            html: msg_text
                    };
//                    mailgun.messages().send(data, function (error, response) {
					fnSender(email,sub_text,msg_text)						

					res.render('../modules/md_login/views/vw_login.html');    
                                   
//                    });

                                   }
                                });
			}
			else
			{
				res.send(401,{ success : false, message : config.get('Msg401') });
			}
		})
	})
		
	}
	else
	{
		res.send(422,{ success : false, message : config.get('Msg422') });
	}

}

exports.datalist = function(req, res){
      var page = parseInt(req.param('vPage')),
         limit = parseInt(req.param('vLimit')),
         skip = page > 0 ? ((page - 1) * limit) : 0;

	  var vgroupfind = [];	
		   vgroupfind = vgroupfind.length > 0 ? {$and :vgroupfind } : {};
         
	data.datalist(vgroupfind,limit,skip, function (err, DataRows) {
		data.countrows(vgroupfind, function (err, DataCount) {			
			res.send(JSON.stringify({Rows:DataRows,TotalRows:DataCount}));			
		});    		
	});    
};

exports.approve = function(req,res){
        var info = req.body;

                                approve_user_id = req.param('id');
                                collection.findOne({'_id': ObjectID(approve_user_id)}, function(err, item) {
                                if(item)
                                {
                                    if('verified' in item && item['verified'])
                                    {
                                                item['approved'] = true
                                                collection.update({'_id' : ObjectID(approve_user_id)},item,{safe:true}, function(err, result) {
                                                if(err)
                                                {
                                                        res.send(501,{ success : false, message : "error 501"});
                                                }
                                                else
                                                {
                                                        name = item['name']
                                                        email = item['email']
                                                        //var msg_text = "Hello here is the forgot passsword link https://indorse-staging.herokuapp.com/password/reset?email=" + email + "&pass_token=" + pass_verify_token;
                                                        var msg_text = "Dear " + name + ", <br><br> Our team has reviewed and approved your login details. <br><br>You may now visit our website: Indorse.io and login with your email address and password that you set, while creating your account at Indose.io: <br><br> The Indorse Community looks forward to your positive participation.<br><br> Thank you and regards <br> Team Indorse <br><br> Please let us know if you have any problems or questions at: <br> www.indorse.io";
                                                        var sub_text = 'Your account has been approved';
                                                        var to_obj = {};
                                                        to_obj[email] = name;
                                                        var data = {
                                                                from: 'Indorse <info@app.indorse.io>',
                                                                to: item['email'],
                                                                subject: sub_text,
                                                                html: msg_text
                                                        };
														fnSender(email,sub_text,msg_text)						                                                        
                                                        //mailgun.messages().send(data, function (error, response) {
                                                        res.send(200,{ success : true, message : "Success"});
														//});
                                                }
                                                })
                                    }
                                    else
                                    {
                                        res.send(422,{ success : false, message : "error 422"});
                                    }
                                }
                                else
                                {
                                    res.send(404,{ success : false, message : "error 404"});
                                }
                            })


}

exports.disapprove = function(req,res){
        var info = req.body;

                        //Log the person out and return success
                                        approve_user_id = req.param('id');
                                        collection.findOne({'_id': ObjectID(approve_user_id)}, function(err, item) {
                                        if(item)
                                        {
                                            if('verified' in item && item['verified'])
                                                        {
                                                        item['approved'] = false
                                                        collection.update({'_id' : ObjectID(approve_user_id)},item,{safe:true}, function(err, result) {
                                                        if(err)
                                                        {
                                                                res.send(501,{ success : false, message : "error 501"});
                                                        }
                                                        else
                                                        {
                                                                res.send(200,{ success : true, message : "error 200"});
                                                        }
                                                        })
                                                        }
                                            else
                                            {
                                                res.send(422,{ success : false, message : "error 422"});
                                            }
                                         }
                                        else
                                        {
                                                res.send(404,{ success : false, message : "error 404"});
                                        }
                                })

 

}
