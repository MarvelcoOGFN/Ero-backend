require('dotenv').config();

const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require("fs");

client.once("ready", () => {
    console.log('\x1b[33m%s\x1b[0m',"Bot is up");
    client.user.setActivity("Climb", { type: "PLAYING" });
    let commands = client.application.commands;

    fs.readdirSync("./src/discord/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);
        commands.create(command.commandInfo);
    });

    // Send embed message to the specified channel after deleting the last message
    const channelId = '1267602632034222292'; // Replace with your channel ID
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        // Fetch the last message and delete it
        channel.messages.fetch({ limit: 1 }).then(messages => {
            const lastMessage = messages.first();
            if (lastMessage) {
                lastMessage.delete()
                    .then(() => {
                        // Get the current timestamp
                        const timestamp = new Date().toLocaleString();

                        // Send the embed after deleting the last message
                        const embed = new MessageEmbed()
                            .setTitle("Backend Status")
                            .setDescription("The ClimbFN Backend has restarted! Please restart your games to continue playing as usual.")
                            .setColor("ORANGE")
                            .setFooter(`Timestamp: ${timestamp}`); // Add timestamp to the footer

                        channel.send({ embeds: [embed] });
                    })
                    .catch(err => console.error("Failed to delete the last message:", err));
            } else {
                // If there's no last message, send the embed directly
                const embed = new MessageEmbed()
                    .setTitle("Backend Status")
                    .setDescription("The ClimbFN Backend has restarted! Please restart your games to continue playing as usual.")
                    .setColor("ORANGE");

                channel.send({ embeds: [embed] });
            }
        }).catch(err => console.error("Failed to fetch the last message:", err));
    } else {
        console.error("Channel not found!");
    }
});

client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./src/discord/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

// Access environment variables
const discordBotToken = process.env.DISCORD_BOT_TOKEN;

client.login(discordBotToken);
