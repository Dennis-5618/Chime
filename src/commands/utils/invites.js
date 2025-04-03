const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Display the amount of people someone has invited')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Select a user')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('leaderboard')
            .setDescription('Displays the invite leaderboard')
            .setRequired(false)
        ),
    async execute(interaction) {
        // Get information from the command options
        const { guild } = interaction;
        const user = interaction.options.getUser('member') ?? interaction.user;
        const toggleLeaderboard = interaction.options.getBoolean('leaderboard') ?? false;

        try {
            // Get the invites from the user
            const invites = await guild.invites.fetch();
            if (!invites.size) return interaction.reply({ content: 'No invites have been found for this server'});

            const inviteCount = new Map();
            invites.forEach(invite => {
                if (invite.inviter) {
                    inviteCount.set(invite.inviter.id, (inviteCount.get(invite.inviter.id) ?? 0) + (invite.uses ?? 0));
                }
            });

            // Get list of all invites
            if (toggleLeaderboard) {
                const sortedInvites = [...inviteCount.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10);

                const leaderboard = sortedInvites
                    .map(([userId, count], index) => `**${index + 1}.** <@${userId}> has invited \`${count}\` people to the server`)
                    .join("\n") ?? "No invites";

                const leaderboardEmbed = new EmbedBuilder()
                    .setTitle("Invite leaderboard")
                    .setColor('#e6534e')
                    .setDescription(leaderboard);
                return await interaction.reply({ embeds: [leaderboardEmbed] });
            };

            const userInviteCount = inviteCount.get(user.id) ?? 0;
            const userEmbed = new EmbedBuilder()
                .setTitle(`${user.tag}'s invites`)
                .setColor('#e6534e')
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setDescription(`**${user.tag}** has invited \`${userInviteCount}\` people to the server`)
            await interaction.reply({ embeds: [userEmbed] });
        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - ${error.message}`);
            await interaction.reply({ content: "An error occurred while getting the invite data", ephemeral: true });
        };
    }
};