const { Events, EmbedBuilder, ChannelType } = require("discord.js");
const Logs = require('../schemas/logs');

module.exports = {
    name: Events.ChannelDelete,
    once: false,
    async execute(channel) {
        try {
            // Ignore DMs
            if (!channel.guild) return;

            // Get the logs channel from the database
            const logsData = await Logs.findOne({ guildId: channel.guild.id });
            if (!logsData) return;

            // Fetch the logs channel
            const logChannel = await channel.guild.channels.fetch(logsData.channelId);
            if (!logChannel) return;

            // Map of the different type of channels
            const channelTypeMap = {
                [ChannelType.GuildAnnouncement]: 'Announcements',
                [ChannelType.GuildCategory]: 'Category',
                [ChannelType.GuildText]: 'Text',
                [ChannelType.GuildVoice]: 'Voice',
                [ChannelType.GuildForum]: 'Forum',
                [ChannelType.GuildStageVoice]: 'Stage voice',
            };

            // Create and send the embed
            const embed = new EmbedBuilder()
                .setTitle('Channel deleted')
                .setColor('#e6534e')
                .setDescription(`
                    **Name:** ${channel.name}
                    **Type:** ${channelTypeMap[channel.type]}    
                `)
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - ${error.message}`);
            return;
        }
    }
};