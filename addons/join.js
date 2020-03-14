var exports = module.exports;

exports.priority = true;

exports.bypass = true;

const successEmoji = '688237903695839243';
const failureEmoji = '688237902999846952';

var fs = require('fs');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.init = function(client) {
	function fetchMsg(id) {
		return client.guilds.cache
			.get('629488591361409034')
			.channels.cache.find((val) => val.name === 'to-be-verified')
			.messages.fetch(id);
	}

	console.log('Initializing Addon "Join"... ');

	client.on('guildMemberAdd', (member) => {
		member.roles.add(member.guild.roles.cache.find((val) => val.name === 'Quarantine'));
		client.guilds.cache
			.get('629488591361409034')
			.channels.cache.find((val) => val.name === 'to-be-verified')
			.send(`**${member}** has joined the gaming gamers... Verify?`)
			.then(async (msg) => {
				const rawData = await readFile('data/quarantine.json');
				let data = JSON.parse(rawData);

				data[msg.id] = member.id;
				data['list'].push(msg.id);

				writeFile('data/quarantine.json', JSON.stringify(data, null, 2));
				console.log(data);
				await msg.react(client.emojis.cache.get(successEmoji));
				await msg.react(client.emojis.cache.get(failureEmoji));
			});
	});

	client.on('messageReactionAdd', async (messageReaction, user) => {
		if (user.bot) return;

		const rawData = await readFile('data/quarantine.json');
		let data = JSON.parse(rawData);

		console.log(data);

		const messageId = messageReaction.message.id;

		if (data.hasOwnProperty(messageId)) {
			const memberId = data[messageId];
			const member = await messageReaction.message.guild.members.cache.get(memberId);
			// const member = await client.fetchUser(memberId);

			console.log('Reaction added on Verification Message! -- ' + messageReaction.emoji.name);
			if (messageReaction.emoji.id === successEmoji) {
				const message = await fetchMsg(messageId);
				try {
					member.roles.remove(member.guild.roles.cache.find((val) => val.name === 'Quarantine'));

					console.log(`${member.displayName} has been verified.`);
					message.edit(`**${member}** has been verified.`);
				} catch (err) {
					console.log('ERORR: cannot remove Role. \n\n' + err);
					message.edit(
						`Too late, **${client.members.fetch(memberId)}** is already verified (or gone in the wind).`
					);
				}

				delete data[messageId];
				data['list'] = data['list'].filter((val) => val !== messageId);

				message.reactions.cache.get(successEmoji).remove();
				message.reactions.cache.get(failureEmoji).remove();
			} else if (messageReaction.emoji.id === failureEmoji) {
				const message = await fetchMsg(messageId);
				try {
					if (member.roles.cache.find((val) => val.name === 'Quarantine')) {
						member.kick('Sorry, but you have been deemed irrelevant. ._.');

						console.log(`Kicking ${member.displayName}.`);
						message.edit(`**${member}** has been kicked.`);
					} else {
						message.edit(`WHAT YA TRYING TO DO?? **${member}** is already verified. No kicking pls.`);
					}
				} catch (err) {
					console.log('ERORR: cannot kick user. \n\n' + err);
					message.edit(
						`Too late, **${client.members.fetch(
							memberId
						)}** is already gone (or there is an error somewhere 😉).`
					);
				}

				delete data[messageId];
				data['list'] = data['list'].filter((val) => val !== messageId);

				message.reactions.cache.get(successEmoji).remove();
				message.reactions.cache.get(failureEmoji).remove();
			}

			writeFile('data/quarantine.json', JSON.stringify(data, null, 2));
		}
	});

	console.log('Initialized "Join".');
};

exports.ready = async function(client) {
	function fetchMsg(id) {
		return client.guilds.cache
			.get('629488591361409034')
			.channels.cache.find((val) => val.name === 'to-be-verified')
			.messages.fetch(id);
	}

	const rawData = await readFile('data/quarantine.json');
	let data = JSON.parse(rawData);
	for (const id of data['list']) {
		console.log(id);
		fetchMsg(id);
	}
};
