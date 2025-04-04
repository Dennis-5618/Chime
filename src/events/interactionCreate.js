const { Events } = require('discord.js');
const { openTicket, closeTicket } = require('../helpers/tickets');
const { enterGiveaway } = require('../helpers/giveaway');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        // Handling command interactions
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return console.error(`\x1b[31m[ERROR]\x1b[0m - Couldn't find the command /${interaction.commandName}`);
            };

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while executing /${interaction.commandName} [${error.message}]`);

                await interaction.reply({
                    content: 'There was an error while executing this command'
                });
            };
        };

        // Handling button interactions
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'chime_open-ticket':
                    await openTicket(interaction);
                    break;
                case 'chime_close-ticket':
                    await closeTicket(interaction);
                    break;
                case 'chime_giveaway-enter':
                    await enterGiveaway(interaction);
                    break;
            };
        };
    }
};