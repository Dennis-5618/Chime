const { readdirSync } = require('fs');
const path = require('path');

module.exports = async (client) => {
	try {
		const eventFiles = readdirSync(path.join(__dirname, '../events')).filter(f => f.endsWith('.js'));

		for (const file of eventFiles) {
			const event = require(path.join(__dirname, '../events', file));

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			};
		};
	} catch (error) {
		console.error(`\x1b[31m[ERROR]\x1b[0m - trying to load event(s): ${error.message}`);
	};
};