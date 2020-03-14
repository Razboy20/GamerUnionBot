/*
MIT License

Copyright (c) 2017 iCrawl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 

Adapted by Razboy20 for the Gamer Union Bot.
*/

/* const PREFIX = process.env.PREFIX;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

var exports = module.exports;

require('dotenv').config();

const Util = require('discord.js');

const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

exports.init = function(client) {
	console.log('Initializing Addon "Music Bot"... ');

	exports.message = async function(client, msg) {
		// eslint-disable-line
		if (msg.author.bot) return undefined;
		if (!msg.content.startsWith(PREFIX)) return undefined;

		const args = msg.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		const serverQueue = queue.get(msg.guild.id);

		let command = msg.content.toLowerCase().split(' ')[0];
		command = command.slice(PREFIX.length);

		if (command === 'play') {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel)
				return msg.channel.send("I'm sorry but you need to be in a voice channel to play music!");
			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) {
				return msg.channel.send(
					'I cannot connect to your voice channel, make sure I have the proper permissions!'
				);
			}
			if (!permissions.has('SPEAK')) {
				return msg.channel.send(
					'I cannot speak in this voice channel, make sure I have the proper permissions!'
				);
			}

			if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
				const playlist = await youtube.getPlaylist(url);
				const videos = await playlist.getVideos();
				for (const video of Object.values(videos)) {
					const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
					await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
				}
				return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
			} else {
				try {
					var video = await youtube.getVideo(url);
				} catch (error) {
					try {
						var videos = await youtube.searchVideos(searchString, 10);
						let index = 0;
						msg.channel.send(`
__**Song selection:**__

${videos.map((video2) => `**${++index} -** ${video2.title}`).join('\n')}

Please provide a value to select one of the search results ranging from 1-10.
					`);
						// eslint-disable-next-line max-depth
						try {
							var response = await msg.channel.awaitMessages(
								(msg2) => msg2.content > 0 && msg2.content < 11,
								{
									maxMatches: 1,
									time: 10000,
									errors: [ 'time' ]
								}
							);
						} catch (err) {
							console.error(err);
							return msg.channel.send('No or invalid value entered, cancelling video selection.');
						}
						const videoIndex = parseInt(response.first().content);
						var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
					} catch (err) {
						console.error(err);
						return msg.channel.send('🆘 I could not obtain any search results.');
					}
				}
				return handleVideo(video, msg, voiceChannel);
			}
		} else if (command === 'help') {
			return msg.reply(
				'here is the ist of **Music** related commands: \n>>> **-play**, plays song from url or name\n**-skip**, skips song\n**-stop**, stops music and bot leaves vc\n**-pause**, bot pauses music\n**-resume**, bot resumes music\n**-volume**, changes volume\n**-np**, shows what is now playing\n**-queue**, shows the queue list'
			);
		} else if (command === 'skip') {
			if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
			serverQueue.connection.dispatcher.end('Skip command has been used!');
			return undefined;
		} else if (command === 'stop') {
			if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end('Stop command has been used!');
			return undefined;
		} else if (command === 'volume') {
			if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send('There is nothing playing.');
			if (args[1] > 10 && msg.author.id != '250809865767878657')
				return msg.channel.send('That is too high! (no earblasting pls thank you) **btw default value is 3**');
			if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
			serverQueue.volume = args[1];
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
			return msg.channel.send(`I set the volume to: **${args[1]}**`);
		} else if (command === 'np') {
			if (!serverQueue) return msg.channel.send('There is nothing playing.');
			return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
		} else if (command === 'queue') {
			if (!serverQueue) return msg.channel.send('There is nothing playing.');
			return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map((song) => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`);
		} else if (command === 'pause') {
			if (serverQueue && serverQueue.playing) {
				serverQueue.playing = false;
				serverQueue.connection.dispatcher.pause();
				return msg.channel.send('⏸ Paused the music for you!');
			}
			return msg.channel.send('There is nothing playing.');
		} else if (command === 'resume') {
			if (serverQueue && !serverQueue.playing) {
				serverQueue.playing = true;
				serverQueue.connection.dispatcher.resume();
				return msg.channel.send('▶ Resumed the music for you!');
			}
			return msg.channel.send('There is nothing playing.');
		}

		return undefined;
	};

	async function handleVideo(video, msg, voiceChannel, playlist = false) {
		const serverQueue = queue.get(msg.guild.id);
		console.log(video);
		const song = {
			id: video.id,
			title: Util.escapeMarkdown(video.title),
			url: `https://www.youtube.com/watch?v=${video.id}`
		};
		if (!serverQueue) {
			const queueConstruct = {
				textChannel: msg.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 3,
				playing: true
			};
			queue.set(msg.guild.id, queueConstruct);

			queueConstruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				play(msg.guild, queueConstruct.songs[0]);
			} catch (error) {
				console.error(`I could not join the voice channel: ${error}`);
				queue.delete(msg.guild.id);
				return msg.channel.send(`I could not join the voice channel: ${error}`);
			}
		} else {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			if (playlist) return undefined;
			else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}
		return undefined;
	}

	function play(guild, song) {
		const serverQueue = queue.get(guild.id);

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
		console.log(serverQueue.songs);

		const dispatcher = serverQueue.connection
			.playStream(ytdl(song.url))
			.on('end', (reason) => {
				if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
				else console.log(reason);
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			})
			.on('error', (error) => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

		serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
	}
	console.log('Initialized addon "Music Bot".');
};
*/
