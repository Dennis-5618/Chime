const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Ticket = require('../../Schemas/ticket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createticket')
        .setDescription('Create a new ticket message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Where you want the ticket message to be sent in')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('category')
            .setDescription('The category under which the tickets will be made')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role required to view the tickets')
            .setRequired(true)
        ),
    async execute(interaction) {
        // Get information from the command options
        const ticketChannel = interaction.options.getChannel('channel');
        const ticketCategory = interaction.options.getChannel('category');
        const ticketRole = interaction.options.getRole('role');

        // Check if the bot has permission to send messages in the ticket channel
        if (!ticketChannel.permissionsFor(interaction.client.user).has('SendMessages')) {
            return interaction.reply(`I don't have permission to send messages in ${ticketChannel}`);
        };

        // Check if the channel already has a ticket
        const existingTicket = await Ticket.findOne({ channelId: ticketChannel.id });
        if (existingTicket) {
            return interaction.reply('There already is a ticket in that channel');
        };

        // Creating and sending the ticket embed message
        const embed = new EmbedBuilder()
            .setTitle('Ticket')
            .setDescription('Click the button below to create a new ticket')
            .setColor('#e6534e');
        const button = new ButtonBuilder()
            .setCustomId('chime_open-ticket')
            .setLabel('Create ticket')
            .setStyle(ButtonStyle.Secondary)
        const buttonMessage = new ActionRowBuilder().addComponents(button);
        const ticketMessage = await ticketChannel.send({ embeds: [embed], components: [buttonMessage] });

        // Replying to the user
        await interaction.reply(`Ticket message has been sent in ${ticketChannel}`);

        // Saving the ticket message to the database
        await Ticket.create({
            messageId: ticketMessage.id,
            categoryId: ticketCategory.id,
            channelId: ticketChannel.id,
            roleId: ticketRole.id
        });
    }
};