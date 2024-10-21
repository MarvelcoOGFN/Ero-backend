const { MessageEmbed } = require("discord.js");
const path = require("path");
const fs = require("fs");
const User = require('../../model/user.js');
const Profiles = require('../../model/profiles.js');
const destr = require("destr");


module.exports = {
    commandInfo: {
        name: "give-fl",
        description: "Allows you to give a user all cosmetics. Note: This will reset all your lockers to default",
        options: [
            {
                name: "user",
                description: "The user you want to give the cosmetic to",
                required: true,
                type: 6
            }
        ]
    },
    execute: async (interaction) => {
        
        const moderators = process.env.MODERATORS.split(',');
        if (!moderators.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const selectedUser = interaction.options.getUser('user');
        const selectedUserId = selectedUser?.id;
        try {
            const targetUser = await User.findOne({ discordId: selectedUserId });
            if (!targetUser) {
                return interaction.editReply({ content: "That user does not own an account" });
            }

            const profile = await Profiles.findOne({ accountId: targetUser.accountId });
            if (!profile) {
                return interaction.editReply({ content: "That user does not have a profile" });
            }

            const allItems = destr(fs.readFileSync(path.join(__dirname, "../../shop/fulllocker.json"), 'utf8'));

            Profiles.findOneAndUpdate({ accountId: targetUser.accountId }, { $set: { "profiles.athena.items": allItems.items } }, { new: true }, (err, doc) => {
            });

          interaction.editReply({ content: `Successfully Added full locker to ${selectedUser}.`, ephemeral: true });

        } catch (error) {
            console.error("An error occurred:", error);
            interaction.editReply({ content: "An error occurred while processing the request." });
        }
    }
};