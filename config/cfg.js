module.exports = {
        "Msg200": "Status Ok",        
        "Msg401": " Unauthorized",
        "Msg403": "Forbidden Error",
        "Msg404": "Not Found",
        "Msg422": "Unprocessable",
        "Msg501": "Not Implemented",        
};

   var nodemailer = require("nodemailer");

   var smtpTransport = nodemailer.createTransport({
		service: "gmail",
		host: "ssl://smtp.googlemail.com",
		port:465,
		auth: {
			user: "rachmattest@gmail.com",
			pass: "P455w0rd"        
		}    
	});


