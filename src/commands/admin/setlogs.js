const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");
const Logs = require('../../schemas/logs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogs')
        .setDescription('Set the logs channel for this server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel you want to use for logs')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    async execute(interaction) {
        // Get the channel from the interaction
        const channel = interaction.options.getChannel('channel');

        try {
                // Checks if the bot has permission to send messages in the logs channel
                if (!channel.permissionsFor(interaction.client.user).has('SendMessages')) {
                    return interaction.reply(`I don't have permission to send messages in ${channel}`);
                };

                // Save the logs channel to the database
                await Logs.findOneAndUpdate(
                    { guildId: interaction.guild.id },
                    { channelId: channel.id },
                    { upsert: true, new: true }
                );

                // Creating and sending the embed
                const embed = new EmbedBuilder()
                    .setTitle('Logs channel updated')
                    .setColor('#e6534e')
                    .setDescription(`Set the logs channel to: ${channel}`)
                await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while setting the logs channel: ${error.message}`);
            interaction.reply('There was an error while trying to set the logs channel, please try again later');
        }
    }
};