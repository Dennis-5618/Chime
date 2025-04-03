const { readdirSync } = require('fs');
const path = require('path');

module.exports = async (client) => {
	const commandsPath = path.join(__dirname, '../commands');
	const commandFolders = readdirSync(commandsPath);

	for (const folder of commandFolders) {
		const folderPath = path.join(commandsPath, folder);
		const commandFiles = readdirSync(folderPath).filter(f => f.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(folderPath, file);
			const command = require(filePath);

			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`\x1b[31m[ERROR]\x1b[0m - The command at ${filePath} is missing a required property`)
			};
		};
	};
};