const { MessageEmbed, User } = require('discord.js');
const UserModel = require('../../model/user.js');

module.exports = {
    commandInfo: {
        name: 'getuserid',
        description: 'Fetch a user\'s account ID from the database.',
        options: [
            {
                name: 'user',
                description: 'The user to fetch account ID for.',
                type: 'USER',
                required: true
            }
        ]
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser('user');

        try {
        
            const moderators = process.env.MODERATORS.split(',');
            if (!moderators.includes(interaction.user.id)) {
                return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
            }

            
            const discordId = user.id;
            const foundUser = await UserModel.findOne({ discordId });

            if (foundUser) {
                
                const embed = new MessageEmbed()
                    .setTitle('User Account ID')
                    .setDescription(`Username: ${foundUser.username}\nAccount ID: ${foundUser.accountId}`)
                    .setColor('#2b2d31');
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.editReply({ content: 'User not found in the database.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            await interaction.editReply({ content: 'An error occurred while fetching the user data.', ephemeral: true });
        }
    },
};
