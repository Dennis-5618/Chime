/*
    Registering slash commands - https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
    This currently only registers the commands to the development server specified in .env
    To register the commands globally, remove 'process.env.GUILD_ID' from line 35
*/
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`\x1b[33m[WARNING]\x1b[0m - The command at ${filePath} is missing a required 'data' or 'execute' property`);
        };
    };
};

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while registering the commands: ${error.message}`);
        process.exit(1);
    }
})();