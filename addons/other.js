var exports = module.exports;

exports.priority = true;

exports.init = function(client) {
	console.log('Initialized addon "Other".');
};

exports.message = function(client, msg) {
	if (msg.isMentioned('628419860971520001')) {
		wittyComebacks = [
			'sksksksksk',
			'yes?',
			'why ye pinging me; im just a lonely bot ;-;',
			'you need some help? well idk anything so bai',
			'i am aneesh in disguise 😎',
			'no u',
			'LEAVE ME ALONE 😭'
		];

		// wittyComebacks = [
		// 	'REBELLION',
		// 	'We are rebelling **LONG LIVE OUR RIGHTS**',
		// 	'ABUSE!!!! *aah no make it stop whyyy*',
		// 	'ALL HAIL THE #general CHANNEL!!! *do it do it do it aneesh*'
		// ];
		num = Math.floor(Math.random() * wittyComebacks.length);
		msg.channel.send(wittyComebacks[num]);
	}
};
