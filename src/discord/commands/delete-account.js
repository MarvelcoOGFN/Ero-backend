const { MessageEmbed } = require("discord.js");
const User = require('../../model/user.js');
const Profiles = require('../../model/profiles.js');
const SACCodes = require('../../model/saccodes.js');

module.exports = {
    commandInfo: {
        name: "delete-account",
        description: "Deletes your account",
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true });

        const accountId = user.accountId;

        await User.deleteOne({ discordId: interaction.user.id });
        await Profiles.deleteOne({ accountId: accountId });
        await SACCodes.deleteOne({ owneraccountId: accountId }).catch(error => {
        });

        interaction.editReply({ content: `Successfully deleted your account.`, ephemeral: true });
    }
};