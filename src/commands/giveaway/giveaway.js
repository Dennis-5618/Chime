const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const ms = require('ms');
const Giveaway = require('../../schemas/giveaway');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a new giveaway')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => option
            .setName('prize')
            .setDescription('The prize for this giveaway')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('duration')
            .setDescription('How long does it last? (example: 10m, 6h, 1w)')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('winners')
            .setDescription('The amount of winners for this giveaway')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel where you want to host the giveaway')
            .setRequired(true)
        ),
    async execute(interaction) {
        // Get the information from the command
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getString('duration');
        const winners = interaction.options.getInteger('winners');
        const channel = interaction.options.getChannel('channel')

        // Calculate the end date
        const endAt = new Date(Date.now() + ms(duration));

        // Create and send the giveaway embed
        const embed = new EmbedBuilder()
            .setTitle('Giveaway started')
            .setDescription(`
            **Prize:** ${prize}
            **Duration:** <t:${Math.floor(endAt.getTime() / 1000)}:R>
            **Winners:** ${winners}`
            )
            .setColor('#e6534e')

        const button = new ButtonBuilder()
            .setCustomId('chime_giveaway-enter')
            .setLabel('🎉 Enter giveaway')
            .setStyle(ButtonStyle.Success)

        const message = await channel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        });

        // Save the giveaway to the database
        await Giveaway.create({
            guildId: interaction.guild.id,
            channelId: channel.id,
            messageId: message.id,
            prize,
            endAt,
            winners,
            entries: []
        });

        // Reply to the user
        await interaction.reply(`Started a giveaway in ${channel}`);
    }
}