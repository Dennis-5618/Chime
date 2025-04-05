const  { Client, Collection, GatewayIntentBits } = require ('discord.js');
const database = require('./utils/database');
const events = require('./utils/events');
const commands = require('./utils/commands');
require('dotenv').config();

// Creating a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

(async () => {
    try {
        // Connecting to the database
        await database();

        // Loading the event and command handlers
        await events(client);
        await commands(client);

        await client.login(process.env.TOKEN);
    } catch (error) {
		console.error(`\x1b[31m[ERROR]\x1b[0m - Chime was unable to start: ${error.message}`);
		process.exit(1);
	};
})();