const { Events } = require('discord.js');
const { startGiveawayTimer } = require('../utils/checkGiveaways');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m - ${client.user.tag} is now online!`);

        // Start the giveaway timer
        startGiveawayTimer(client);
    }
};