const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot\'s ping'),
    async execute(interaction) {
        // Send initial message
        await interaction.reply({
            content: 'Pinging...',
            flags: MessageFlags.Ephemeral
        });

        // Fetch inital message and calculate the latency
        const message = await interaction.fetchReply();
        const responseTime = message.createdTimestamp - interaction.createdTimestamp
        const wsPing = interaction.client.ws.ping;

        // Update message with latency
        await interaction.editReply({
            content: `**Response time:** \`${responseTime}ms\`\n**API latency:** \`${wsPing}ms\``
        });
    }
};