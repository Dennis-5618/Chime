const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m - ${client.user.tag} is now online!`);
    }
};