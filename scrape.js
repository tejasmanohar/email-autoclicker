var MailParser  = require('mailparser').MailParser;
var Mbox        = require('node-mbox');
var mbox        = new Mbox('mbox');
var get = require('simple-get')
var request = require('request')

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

// wait for message events
mbox.on('message', function(msg) {
	// parse message using MailParser
	var mailparser = new MailParser({ streamAttachments : true });
	mailparser.on("end", function(mail_object){
		if(mail_object.subject.indexOf("Transmission demandée / Transmission requested") > 0 && typeof mail_object.text !== 'undefined') {
			var match = mail_object.text.match(/You accept the trade of the domain name :\n(http[^ \n]+)/);
			if(match !== null) {
				console.log("MATCH: " + match[1])
				request(match[1], function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log(response.statusCode + "\n") // Show the HTML for the Google homepage.
				  } else {
				  	console.log("not successful request");
				  }
				})
			}
		}
	});
	mailparser.write(msg);
	mailparser.end();
});

// pipe stdin to mbox parser
process.stdin.pipe(mbox);
