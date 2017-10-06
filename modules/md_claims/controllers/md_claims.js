var data = require("../../../modules/md_claims/models/mo_claims")
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
var vmodule = "claims";
var vtitle = "Claims";
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
	res.render('../modules/md_home/views/index.html',{username:req.session.user.name,module:'claims',fnmodule:req.param('m'),id:req.param('id'),claim_id:req.param('claim_id')});    					 				   	
};

exports.create = function(req, res){	
	res.render("../modules/md_"+vmodule+"/views/add_"+vmodule+".html",{title:vtitle});    	
};

exports.data = function(req, res){	
	res.render("../modules/md_"+vmodule+"/views/vw_"+vmodule+".html",{title:vtitle});    	
};

exports.detail = function(req, res){		
	res.render("../modules/md_"+vmodule+"/views/vw_claims_detail.html",{title:vtitle,claim_id:req.param('claim_id')});    	
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

function create_votes(users, voting_round_id, claim_id) {
    users.forEach(function(user) {
        vote = {};
        vote['claim_id'] = claim_id;
        vote['voter_id'] = user['_id'].toString();
        vote['voting_round_id'] = voting_round_id;
        db.get().collection('votes', function(err, votes_collection) {
            votes_collection.insert(vote, {
                safe: true
            }, function(err, result) {

                if(!err)
                {
                    name = user['name']
                    email = user['email']
                    var msg_text = "Dear " + name + ", <br><br> A new claim has been opened up for you to vote on. You can see the claim in this <a href='localhost:5000/claims/" + claim_id + "'>link</a> <br><br> The Indorse Community looks forward to your positive participation.<br><br> Thank you and regards <br> Team Indorse <br><br> Please let us know if you have any problems or questions at: <br> www.indorse.io";
                    var sub_text = 'You are invited to vote on a new claim';
                    var data = {
                        from: 'Indorse <info@app.indorse.io>',
                        to: email,
                        subject: sub_text,
                        html: msg_text
                    };
//                    mailgun.messages().send(data, function (error, response) {                    
//                    });   
                    fnSender(email,sub_text,msg_text)   
                }

            })
        })
    });
}

function create_votinground(claim_id,owner_id) {
    console.log('calling voting round creationg function for claim id ' + claim_id);
    db.get().collection('votingrounds', function(err, votinground_collection) {
        if (!err) {
            voting_round = {};
            voting_round['claim_id'] = claim_id;
            voting_round['end_registration'] = Math.floor(Date.now() / 1000) ;
            voting_round['end_voting'] = Math.floor(Date.now() / 1000) ;
//            voting_round['end_registration'] = Math.floor(Date.now() / 1000) + config.get('registerperiod');
//            voting_round['end_voting'] = Math.floor(Date.now() / 1000) + config.get('voteperiod');
            
            voting_round['status'] = 'in_progress';
            console.log(voting_round)
            votinground_collection.insert(voting_round, {
                safe: true
            }, function(err, result) {
                if (!err) {
                    voting_round_id = result['ops'][0]['_id'].toString();
                    console.log(voting_round_id);
                    db.get().collection('users', function (err, users_collection) {
                                
                                emails_array = ['rachmat.cad83@gmail.com','dipesh@attores.com','david@attores.com','avad@attores.com','telepras@gmail.com','kedar@blimp.co.in'];
                                users_collection.find({'email': {'$in': emails_array}}).toArray(function (err, user_results) {
                               
                                    var  limit = 5;
                                    users_collection.aggregate([{'$match' : {'approved': true,'email' : {'$nin' : emails_array}}},{'$sample' : {'size' : limit}}]).toArray(function (err, all_users) {
                                    
                                            user_results = user_results.concat(all_users);
                                            console.log('Seleceted users for voting');
                                            user_results.forEach(function(user){

                                                    console.log(user['email']);

                                            })
                                            create_votes(user_results, voting_round_id, claim_id)
                                    })
                            })
                    })
                }
            })
        } else {
            console.log(err)
        }
    })
}

exports.process = function(req, res) {

        var info = req.body;
        if ('title' in info && info['title'] != '' && 'desc' in info && info['desc'] != '' && 'proof' in info && info['proof'] != '') {

            db.get().collection('users', function(err, collection) {
                collection.findOne({
                    'email': req.session.user.email                    
                }, function(err, item) {

                    if (item) {

                        if ('claim_id' in info && info['claim_id'] != '') {
                            res.send(501, {
                                success: false,
                                message: 'Claim id should not be sent'
                            });
                        } else {
                            var claim = {};
                            claim['title'] = info['title'];
                            claim['desc'] = info['desc']
                            claim['proof'] = info['proof']
                            claim['state'] = 'new';
                            claim['visible'] = true
                            claim['ownerid'] = item['_id'].toString();
                            db.get().collection('claims', function(err, collection1) {
                                collection1.insert(claim, {
                                    safe: true
                                }, function(err, result) {
                                    if (err) {
                                        res.send(501, {
                                            success: false,
                                            message: 'Something went wrong'
                                        });
                                    } else {
                                        if ('result' in result && 'ok' in result['result'] && result['result']['ok'] == 1) {
                                            create_votinground(result['ops'][0]['_id'].toString(),claim['ownerid']);
                                            res.send(200, {
                                                success: true,
                                                claim: result['ops'],
                                                message: config.get('Msg200')
                                            });
                                        } else {
                                            res.send(501, {
                                                success: false,
                                                message: config.get('Msg501')
                                            });
                                        }

                                    }

                                })
                            })

                        }



                    } else {
                        res.send(404, {
                            success: false,
                            message: config.get('Msg404')
                        });
                    }

                })
            })


        } else {
            res.send(422, {
                success: false,
                message: config.get('Msg422')
            });
        }
}
exports.datalist = function(req, res){
    var find = {'ownerid':req.session.user._id};
         console.log(find)
	data.datalist(find, function (err, DataRows) {
		data.countrows(find, function (err, DataCount) {			
			res.send(JSON.stringify({Rows:DataRows,TotalRows:DataCount}));			
		});    		
	});    
};
exports.getclaims = function(req, res) {

        if (req.session.user.email != 'undefined') {
            db.get().collection('users', function(err, collection) {
                collection.findOne({
                    'email': req.session.user.email
                }, function(err, item) {
                    if (item) {
                        db.get().collection('claims', function(err, collection1) {
                            if (err) {
                                res.send(501, {
                                    success: false,
                                    message: config.get('Msg501')
                                });
                            } else {
                                collection1.find({
                                    'ownerid': req.session.user._id
                                }).toArray(function(err, results) {

                                    var claim_ids = [];
                                    results.forEach(function(claim) {
                                        claim_ids.push(claim['_id'].toString());
                                    })
                                    db.get().collection('votingrounds', function(err, votinground_collection) {
                                        votinground_collection.find({
                                            'claim_id': {
                                                '$in': claim_ids
                                            }
                                        }).toArray(function(err, votingrounds) {
                                            var results_final = [];
                                            var active_voting_round = null;
                                            var active_votinground_ids = [];
                                            for (var i = 0, len = results.length; i < len; i++) {
                                                var result_item = {};
                                                result_item.claim = results[i];
                                                var item_voting_rounds = [];
                                                votingrounds.forEach(function(votinground) {
                                                    if (votinground['claim_id'] == results[i]._id.toString()) {
                                                        if (votinground['status'] == "in_progress") {
                                                            result_item.votinground = votinground;
                                                            active_votinground_ids.push(votinground['_id'].toString());

                                                        }
                                                    }
                                                })
                                                results_final.push(result_item);
                                            }
                                            collection.findOne({
                                                'email': req.session.user.email
                                            }, function(err, user) {
                                                if (user) {
                                                    db.get().collection('votes', function(err, votes_collection) {
                                                        votes_collection.find({
                                                            'voting_round_id': {
                                                                '$in': active_votinground_ids
                                                            },
                                                            'voter_id': user['_id'].toString()
                                                        }).toArray(function(err, votes) {
                                                            if (!err) {
                                                                for (var i = 0, len = results_final.length; i < len; i++) {
                                                                    votes.forEach(function(vote) {
                                                                        if (results_final[i].claim._id.toString() == vote['claim_id']) {
                                                                            results_final[i].vote = vote;
                                                                        }
                                                                    })
                                                                }
                                                                res.send(200, {
                                                                    success: true,
                                                                    'claims': results_final
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        })
                                    })
                                })
                            }

                        })
                    } else {
                        res.send(404, {
                            success: false,
                            message: "error 404"
                        });
                    }
                })
            })
        } 
        
}

exports.getclaim = function(req, res) {
        if (req.param('claim_id') != '') {
			var ObjectID = require('mongodb').ObjectID;
		   		   
            db.get().collection('claims', function(err, collection) {
                if (!err) {
                    collection.findOne({
                        '_id': new ObjectID(req.param('claim_id'))
                    }, function(err, item) {
                        if (item) {

                            db.get().collection('votingrounds', function(err, votinground_collection) {
                                votinground_collection.find({
                                    'claim_id': req.param('claim_id')
                                }).toArray(function(err, votingrounds) {
                                    if (!err) {
                                        var active_votinground = null;
                                        var vote = null;
                                        votingrounds.forEach(function(votinground) {
                                            if (votinground.status == "in_progress")
                                                active_votinground = votinground;
                                        })
                                        if (active_votinground != null) {
                                            db.get().collection('users', function(err, collection) {

                                                collection.findOne({
                                                    'email': req.session.user.email
                                                }, function(err, user) {

                                                    if (user) {
                                                        db.get().collection('votes', function(err, votes_collection) {

                                                            votes_collection.findOne({
                                                                'voting_round_id': active_votinground['_id'].toString(),
                                                                'voter_id': user['_id'].toString()
                                                            }, function(err, vote) {

                                                                if (vote) {
                                                                    res.send(200, {
                                                                        success: true,
                                                                        claim: item,
                                                                        votingrounds: votingrounds,
                                                                        vote: vote
                                                                    });
                                                                }

                                                            })

                                                        })
                                                    }

                                                })

                                            })
                                        } else {
                                            res.send(200, {
                                                success: true,
                                                claim: item,
                                                votingrounds: votingrounds,
                                                vote: vote
                                            });                                                                                                               
                                        }
                                    } else {
                                        res.send(501, {
                                            success: false,
                                            message: config.get('Msg501')
                                        });
                                    }
                                })
                            })
                        } else {
                            res.send(404, {
                                success: false,
                                'message': config.get('Msg404')
                            });
                        }
                    })
                }
            })
        } else {
            res.send(422, {
                success: false,
                message: config.get('Msg422')
            });
        }
}
