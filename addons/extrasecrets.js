var exports = module.exports;

const prefix = process.env.PREFIX;

exports.priority = true;

exports.bypass = true;

exports.init = function(client) {
	console.log('Initialized addon "Secrets".');
};

exports.message = function(client, msg) {
	const command = msg.content.split(' ')[0].slice(prefix.length);

	if (msg.content.substr(0, prefix.length) === prefix) {
		if (
			msg.author.id === '250809865767878657' ||
			msg.author.id === '432308392682586113' ||
			msg.author.id === '148223809080524800'
		) {
			if (command === 'nick') {
				msg.guild.members
					.get(client.user.id)
					.setNickname(msg.content.slice(prefix.length + command.length + 1))
					.catch(function(err) {
						msg.channel.send('There was an error in changing my nickname. Err: ' + err);
						console.log(err);
						isRejected = true;
					})
					.then(function(data) {
						if (!this.isRejected) msg.channel.send('My nickname has been changed.');
						console.log(this);
					});
			} else if (msg.author.id === '250809865767878657' && command === 'username') {
				client.user
					.setUsername(msg.content.slice(prefix.length + command.length + 1))
					.catch(function(err) {
						msg.channel.send('There was an error in changing my username. Err: ' + err);
						console.log(err);
						isRejected = true;
					})
					.then(function(data) {
						if (!this.isRejected) msg.channel.send('My username has been changed.');
						console.log(this);
					});
			} else if (command === 'clear') {
				const num = parseInt(msg.content.slice(prefix.length + command.length + 1));
				if (num === NaN) return;
				num++;
				msg.channel
					.fetchMessages({ limit: num })
					.then((fetched) => {
						console.log('Attempting to clear channel of ' + num + ' messages...');
						const messages = fetched;

						msg.channel.bulkDelete(messages, true).then(() => {
							msg.channel.send(num + ' messages cleared!').then((messageToDelete) => {
								setTimeout(() => {
									messageToDelete.delete();
								}, 3000);
							});
						});
					})
					.catch(console.error);
			} else if (command === 'clearevent') {
				msg.channel
					.fetchMessages({ limit: 100 })
					.then((fetched) => {
						console.log('Attempting to clear channel...');
						const messages = fetched.filter((fetchedMsg) => fetchedMsg.author.id !== '148223809080524800');

						msg.channel.bulkDelete(messages, true);
					})
					.catch(console.error);
			}
		}
	}

	if (msg.content.includes('https://') && msg.content.includes('cat') && msg.author.id === '375477650476498954') {
		msg.delete();
		msg.reply('no more cat pictures. You got me?').then((message) => {
			setTimeout(() => {
				message.delete();
			}, 5000);
		});
	}
};
