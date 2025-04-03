const { ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../Schemas/ticket');

// Opening tickets
async function openTicket(interaction) {
    try {
        // Getting ticket from database
        const ticketData = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticketData) return interaction.reply({
            content: 'Unable to find ticket data',
            flags: 64
        });

        // Creating the ticket channel
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: ticketData.categoryId,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['ViewChannel']
                },
                {
                    id: interaction.user.id,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                },
                {
                    id: ticketData.roleId,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                }
            ]
        });

        // Reply to the user
        await interaction.reply({
            content: `Your ticket has been created in: ${ticketChannel}`,
            flags: 64
        });

        // Send inital message in the ticket
        const embed = new EmbedBuilder()
            .setTitle('New ticket')
            .setDescription(`${interaction.user} has created a new ticket`)
            .setColor('#e6534e')
        const button = new ButtonBuilder()
            .setCustomId('chime_close-ticket')
            .setLabel('Close ticket')
            .setStyle(ButtonStyle.Danger)
        const closeButton = new ActionRowBuilder().addComponents(button);
        await ticketChannel.send({ embeds: [embed], components: [closeButton] });

    } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying to open a ticket: ${error}`);
        await interaction.reply({
            content: 'There was an error while opening your ticket, please try again later',
            flags: 64
        })
    }
}

// Closing tickets
async function closeTicket(interaction) {
    try {
        // Send closing message
        await interaction.channel.send('Closing ticket...');

        // Wait 5 seconds before deleting the channel
        setTimeout(async () => {
            try {
                await interaction.channel.delete();
                await interaction.user.send(`Your ticket in \`${interaction.guild.name}\` has been closed`);
            } catch (error) {
                console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying to clos a ticket: ${error}`)
                interaction.channel.send('Error while closing the ticket, please try again later')
            }
        }, 5000)
    } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying to close a ticket: ${error}`);
        await interaction.reply({
            content: 'There was an error while closing your ticket, please try again later',
            flags: 64
        });
    }
};

module.exports = { openTicket, closeTicket };