const { MessageEmbed } = require("discord.js");
const register = require("../../structs/register.js");

module.exports = {
    commandInfo: {
        name: "create",
        description: "Creates an account on Luna.",
        options: [
            {
                name: "email",
                description: "Your email.",
                required: true,
                type: 3 // string
            },
            {
                name: "username",
                description: "Your username.",
                required: true,
                type: 3
            },
            {
                name: "password",
                description: "Your password.",
                required: true,
                type: 3
            }
        ],
    },
    execute: async (interaction) => {
        try {
            // Defer the reply to allow time for processing
            await interaction.deferReply({ ephemeral: true });

            const { options } = interaction;
            const discordId = interaction.user.id;
            const email = options.get("email").value;
            const username = options.get("username").value;
            const password = options.get("password").value;

            const resp = await register.registerUser(discordId, username, email, password);

            let embed = new MessageEmbed()
                .setColor(resp.status >= 400 ? "#EE4B2B" : "#FF00FF")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setFields(
                    { name: 'Message', value: resp.message },
                )
                .setTimestamp();

            if (resp.status >= 400) {
                return await interaction.editReply({ embeds: [embed], ephemeral: true });
            }

            // Send DM with the token
            await interaction.user.send({
                embeds: [
                    new MessageEmbed()
                        .setColor("#00FF00")
                        .setTitle("Account Created")
                        .setDescription(`Your account has been successfully created!`)
                        .addField("Login Token", resp.token)
                        .setTimestamp()
                ]
            });

            // Reply to the original interaction
            await interaction.editReply({ content: "You successfully created an account! Check your DMs for the login token.", ephemeral: true });
        } catch (error) {
            console.error("Command execution error:", error);

            // Handle errors gracefully
            if (error.code === 10062) {
                await interaction.editReply({ content: "Interaction expired or unknown. Please try again.", ephemeral: true });
            } else {
                await interaction.editReply({ content: "An unexpected error occurred. Please try again later.", ephemeral: true });
            }
        }
    }
};
