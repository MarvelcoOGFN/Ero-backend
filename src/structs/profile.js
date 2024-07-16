const fs = require('fs').promises;

async function createProfiles(accountId) {
    const profiles = {};

    try {
        const files = await fs.readdir('./src/Profiles');

        for (const fileName of files) {
            const filePath = `../Profiles/${fileName}`;
            const profile = require(filePath);

            profile.accountId = accountId;
            profile.created = new Date().toISOString();
            profile.updated = new Date().toISOString();

            profiles[profile.profileId] = profile;
        }
    } catch (error) {
        console.error('Error reading default profiles:', error.message);
    }

    return profiles;
}

async function validateProfile(profileId, profiles) {
    try {
        const profile = profiles[profileId];

        if (!profile || !profileId) {
            throw new Error('Invalid profile/profileId');
        }
    } catch (error) {
        console.error('Error validating profile:', error.message);
        return false;
    }

    return true;
}

async function updateProfile(profileId, profiles, updatedData) {
    try {
        const profile = profiles[profileId];

        if (!profile) {
            throw new Error('Profile not found');
        }

        Object.assign(profile, updatedData);
        profile.updated = new Date().toISOString();
    } catch (error) {
        console.error('Error updating profile:', error.message);
        throw error;
    }
}

module.exports = {
    createProfiles,
    validateProfile,
    updateProfile,
};
