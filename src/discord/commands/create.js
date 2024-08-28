const { MessageEmbed } = require("discord.js");
const register = require("../../structs/register.js");

module.exports = {
    commandInfo: {
        name: "create",
        description: "Creates an account on Ero backend.",
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
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;

        const discordId = interaction.user.id;
        const email = options.get("email").value;
        const username = options.get("username").value;
        const password = options.get("password").value;

        await register.registerUser(discordId, username, email, password).then(resp => {
            let embed = new MessageEmbed()
            .setColor(resp.status >= 400 ? "#EE4B2B" : "#FF00FF")
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setFields(
                { name: 'Message', value: resp.message },
            )
            .setTimestamp()

            if (resp.status >= 400) return interaction.editReply({ embeds: [embed], ephemeral: true });

            (interaction.channel ? interaction.channel : interaction.user).send({ embeds: [embed] });
            interaction.editReply({ content: "You successfully created an account!", ephemeral: true });
        });
    }
}