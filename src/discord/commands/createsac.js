const { MessageEmbed } = require("discord.js");
const Sac = require("../../structs/sac.js");
const fs = require("fs");
require("dotenv").config();

module.exports = {
    commandInfo: {
        name: "createsac",
        description: "Creates a Support-A-Creator Code.",
        options: [
            {
                name: "code",
                description: "The Code.",
                required: true,
                type: 3 
            },
            {
                name: "owner-id",
                description: "Owner ID of the Code.",
                required: true,
                type: 3
            },
        ],
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const moderators = process.env.MODERATORS.split(','); 

        if (!moderators.includes(interaction.user.id)) return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });

        const { options } = interaction;

        const code = options.get("code").value;
        const accountId = options.get("owner-id").value;
        const creator = interaction.user.id;
        await Sac.createSAC(code, accountId, creator).then(resp => {

            if (resp.message == undefined) return interaction.editReply({ content: "There was an unknown error!", ephemeral: true})

            if (resp.status >= 400) return interaction.editReply({ content: resp.message, ephemeral: true });

            interaction.editReply({ content: resp.message, ephemeral: true });
        });
    }
}
