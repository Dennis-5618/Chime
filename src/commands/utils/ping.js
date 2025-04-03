const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot\'s ping'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Pinging...',
            flags: MessageFlags.Ephemeral
        });

        const message = await interaction.fetchReply();

        const responseTime = message.createdTimestamp - interaction.createdTimestamp
        const wsPing = interaction.client.ws.ping;

        await interaction.editReply({
            content: `**Response time:** \`${responseTime}ms\`\n**API latency:** \`${wsPing}ms\``
        });
    }
};