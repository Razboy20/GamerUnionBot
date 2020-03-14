// Made by @GrumptyDumpty (aka The Almighty One)

// Modified by @Razboy20

require('dotenv').config();

var exports = module.exports;

let serious = 'lacking';

const prefix = process.env.PREFIX;

String.prototype.containsAny = function(array) {
	for (i in array) {
		if (this.includes(array[i])) return true;
	}
	return false;
};

String.prototype.replaceMentions = function(msg) {
	const mentions = this.match(/(?<=\<@!?)(\d*?)(?=\>)/gm);

	let toReturn = this.valueOf();

	if (mentions)
		mentions.forEach((id) => {
			const user = msg.guild.members.cache.get(id);
			if (user.displayName) toReturn = toReturn.replace(new RegExp('<@!?' + id + '>', 'g'), user.displayName);
		});

	console.log('Substitution result: ', toReturn);
	return toReturn;
};

adminUsers = [ '250809865767878657', '432308392682586113', '148223809080524800', '268944475282210843' ];

phrases = [ "I'M", 'IM', 'I’M', 'IMMA', 'IMA', 'IMM', 'IMMM' ];

exports.message = function(client, msg) {
	let messageArray = msg.content.split(' ');
	let cmd = messageArray[0].slice(prefix.length);
	let args = messageArray.slice(1);

	if (msg.author.id.containsAny(adminUsers) && cmd.toUpperCase() === 'SERIOUS') {
		serious === 'very serious' ? (serious = 'lacking') : (serious = 'very serious');
		msg.channel.send("DadBot's seriousness is now set to: **" + serious + '**.');
	} else if (serious === 'very serious') {
		return;
	} else if (messageArray[0].toUpperCase().containsAny(phrases)) {
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

		const output = adjective.replaceMentions(msg);

		msg.channel.send(`Hi ${output}, I'm dad!`);
	}
};
