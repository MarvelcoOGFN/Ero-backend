const User = require("../../model/user.js");
const Profiles = require("../../model/profiles.js");
const fs = require("fs");
require("dotenv").config();

module.exports = {
    commandInfo: {
        name: "vbucks",
        description: "Give a user vbucks",
        options: [
            {
                name: "user",
                description: "Mention the user you want to give vbucks to",
                required: true,
                type: 6 // user mention
            },
            {
                name: "vbucks",
                description: "Amount of vbucks you want to give",
                required: true,
                type: 3 // string
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const moderatorIds = process.env.MODERATORS.split(",");
        if (!moderatorIds.includes(interaction.user.id)) {
            return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        const { options } = interaction;
        const discordUser = options.getUser("user");
        const targetUser = await User.findOne({ discordId: discordUser.id });
        if (!targetUser) {
            return interaction.editReply({ content: "The account associated with this Discord user does not exist.", ephemeral: true });
        }
        
        const vbucks = parseInt(options.get("vbucks").value);

        const profile = await Profiles.findOneAndUpdate(
            { accountId: targetUser.accountId },
            { $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': vbucks } }
        );
        if (!profile) {
            return interaction.editReply({ content: "The user does not have an account registered", ephemeral: true });
        }

        interaction.editReply({ content: `Successfully gave ${discordUser.username} ${vbucks} Vbucks`, ephemeral: true });
    }
}
