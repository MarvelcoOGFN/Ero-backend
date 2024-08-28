require('dotenv').config();

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require("fs");

client.once("ready", () => {
    console.log('\x1b[33m%s\x1b[0m',"Bot is up");
    client.user.setActivity("Ero backend", { type: "PLAYING" });
    let commands = client.application.commands;

    fs.readdirSync("./src/discord/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commands.create(command.commandInfo);
    });
});

client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./src/discord/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

const discordBotToken = process.env.DISCORD_BOT_TOKEN;

client.login(discordBotToken);