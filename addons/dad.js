// Made by @GrumptyDumpty (aka [Redacted])

// Modified by @Razboy20

require('dotenv').config();

var exports = module.exports;

let serious = 'lacking';

const prefix = process.env.PREFIX;

exports.message = function(client, msg) {
	let messageArray = msg.content.split(' ');
	let cmd = messageArray[0].slice(prefix.length);
	let args = messageArray.slice(1);

	if (
		(msg.author.id === '250809865767878657' ||
			msg.author.id === '432308392682586113' ||
			msg.author.id === '148223809080524800') &&
		cmd.toUpperCase() === 'SERIOUS'
	) {
		serious === 'very serious' ? (serious = 'lacking') : (serious = 'very serious');
		msg.channel.send("DadBot's seriousness is now set to: **" + serious + '**.');
	} else if (serious === 'very serious') {
		return;
	} else if (
		messageArray[0].toUpperCase() === "I'M" ||
		messageArray[0].toUpperCase() === 'IM' ||
		messageArray[0].toUpperCase() === 'I’M'
	) {
		let adjective;
		if (args.length === 1) {
			adjective = messageArray[1];
		} else if (args.length > 1) {
			adjective = args.join(' ');
		}

		switch (messageArray[1].toUpperCase()) {
			case 'A':
				adjective = adjective.slice(2);
				break;
			case 'AN':
				adjective = adjective.slice(3);
				break;
			default:
				break;
		}

		msg.channel.send(`Hi ${adjective}, I'm dad!`);
	}
};
