const { SlashCommandBuilder } = require('discord.js');
const Ticket = require('../../Schemas/ticket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteticket')
        .setDescription('Delete ticket message from a channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel where the ticket message is')
            .setRequired(true)
        ),
    async execute(interaction) {
        const ticketChannel = interaction.options.getChannel('channel');

        try {
            // Get ticket from database
            const ticketData = await Ticket.findOne({ channelId: ticketChannel.id });
            if (!ticketData) return interaction.reply({
                content: 'Unable to find ticket data',
                flags: 64
            });

            // Deleting the ticket message
            const ticketMessage = await ticketChannel.messages.fetch(ticketData.messageId);
            await ticketMessage.delete();
            await Ticket.deleteOne({ channelId: ticketChannel.id });

            // Replying to the user
            await interaction.reply('The ticket message has been deleted');

        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying to close a ticket: ${error}`);
            await interaction.reply({
                content: 'There was an error while closing the ticket, please try again later',
                flags: 64
            });
        }
    }
};