const axios = require('axios');
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

var opus = require('opusscript');

// get addons -- Loader made by tbranyen

var addons = [];

let botOn = true;

var normalizedPath = require('path').join(__dirname, 'addons');

require('fs').readdirSync(normalizedPath).forEach(function(file) {
	if (file.substr(-3) == '.js') addons.push(require('./addons/' + file));
});

const prefix = process.env.PREFIX;

addons.forEach((addon) => {
	if (addon.init) addon.init(client);
});

client.on('ready', () => {
	console.log('Logged in as ' + client.user.tag + '!');
	client.user.setActivity("peeps be gamein'", {
		type: 'WATCHING'
	});
	client.user.setStatus('online').then().catch(console.error);
	addons.forEach((addon) => {
		if (addon.ready) addon.ready(client);
	});
});

client.on('message', (msg) => {
	if (
		msg.author.id === '250809865767878657' ||
		msg.author.id === '432308392682586113' ||
		msg.author.id === '148223809080524800'
	) {
		if (msg.content.substr(0, prefix.length) === prefix) {
			const command = msg.content.split(' ')[0].slice(prefix.length);

			if (command === 'botstop') {
				botOn = false;
				msg.channel.send('Bot stopped until further notice!');
				client.user.setStatus('invisible').then(console.log).catch(console.error);
				console.log('\n------------\nBOT ON LOCKDOWN.\n------------\n');
			} else if (command === 'botstart') {
				botOn = true;
				msg.channel.send('Bot back on.');
				client.user.setStatus('online').then(console.log).catch(console.error);
				console.log('\n------------\nBot back online.\n------------\n');
			}
		}
	}

	//checking if author is a bot
	if (msg.author.bot == true) {
		return;
	}
	try {
		addons.forEach((addon) => {
			if (addon.message) {
				if (botOn) {
					addon.message(client, msg);
				} else if (addon.bypass) {
					addon.message(client, msg);
				}
			}
		});
	} catch (error) {
		console.log('Error in addon execution: ' + error);
	}
});

client.on('messageUpdate', (oldmsg, newmsg) => {
	if (botOn == false) {
		return;
	}

	addons.forEach((addon) => {
		if (addon.messageEdit) addon.messageEdit(client, oldmsg, newmsg);
	});
});

client.login(process.env.SECRET_TOKEN).catch(() => {
	console.error(
		'\nERROR: Incorrect login details were provided. Please change the client login token to a valid token.\n'
	);
	process.exit();
});
