const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Displays some information about a user')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Select a user')
            .setRequired(false)
        ),
    async execute(interaction) {
        // Get user information, defaults to self if no user specified
        const user = interaction.options.getUser('member') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        // Get list of users roles and removing the @everyone role from the list
        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .join(', ') || 'None';

        // Formatting the timestamp to show full date and how long ago
        const formattedTimestamp = (timestamp) => timestamp
            ? `<t:${Math.floor(timestamp / 1000)}:F> (<t:${Math.floor(timestamp / 1000)}:R>)`
            : 'N/A';

        // Checking if the user is currently boosting the server
        const serverBooster = member.premiumSinceTimestamp
            ? formattedTimestamp(member.premiumSinceTimestamp)
            : 'Not boosting the server';

        // Gets the users current activity status
        const activities = member.presence?.activities || [];
        const activityList = activities.length
            ? activities.map(a => `${a.type.toLowerCase().replace('_', ' ')}: ${a.name}`).join('\n')
            : 'None';

        // Creating and sending the embed
        const embed = new EmbedBuilder()
            .setTitle('User information')
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor('#e6534e')
            .addFields(
                { name: 'Username', value: user.username, inline: true },
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Current activity', value: activityList, inline: false },
                { name: 'Server booster', value: serverBooster, inline: true },
                { name: 'Account created at', value: formattedTimestamp(user.createdTimestamp), inline: false },
                { name: 'Joined the server', value: formattedTimestamp(member.joinedTimestamp), inline: true },
                { name: 'Roles', value: roles, inline: false }
            )
        await interaction.reply({ embeds: [embed] });
    }
};