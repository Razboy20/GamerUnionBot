var exports = module.exports;

exports.init = function(client) {
	console.log('BOT INIT');
	// ... you can do stuff here on the init of the client. (this is before the bot logs in)
};

exports.ready = function(client) {
	console.log('BOT READY');
	// ... you can do stuff here on the ready of the client. (this is when the bot logs in)
};

exports.message = function(client, msg) {
	try {
		console.log(msg.member.displayName + ': ' + msg.content);
	} catch (err) {
		console.log('\nError in writing to log. No clue why ⊙▽⊙\nErr: ' + err + '\n');
	}
	// ... this runs when the bot detects a message sent

	// simple ping pong
	// if (msg.content === '!ping') {
	// 	msg.channel.send('Pong!');
	// }
};

exports.messageEdit = function(client, oldmsg, newmsg) {
	// ... you can do stuff here on the edit of a message. In this case, I am parsing back into message, so it acts as if a msg was sent.
	exports.message(client, newmsg);
};
