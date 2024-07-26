const User = require("../../model/user.js");
const functions = require("../../structs/functions.js");
const Profiles = require("../../model/profiles.js");
const fs = require("fs");
require("dotenv").config();

module.exports = {
    commandInfo: {
        name: "vbucks",
        description: "Give a user vbucks",
        options: [
            {
                name: "username",
                description: "Username of the person you want to give vbucks to",
                required: true,
                type: 3 // string
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
        const targetUser = await User.findOne({ username_lower: options.get("username").value.toLowerCase() });
        if (!targetUser) {
            return interaction.editReply({ content: "The account username you entered does not exist.", ephemeral: true });
        }
        
        const vbucks = parseInt(options.get("vbucks").value);

        const profile = await Profiles.findOneAndUpdate(
            { accountId: targetUser.accountId },
            { $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': vbucks } }
        );
        if (!profile) {
            return interaction.editReply({ content: "The user does not have an account registered", ephemeral: true });
        }

        interaction.editReply({ content: `Successfully gave ${targetUser.username} ${vbucks} Vbucks`, ephemeral: true });
    }
}
