const fs = require("fs");
const path = require("path");

function createProfiles(accountId) {
    let profiles = {};

    const profilesDir = path.join(__dirname, ".." , "Profiles");

    fs.readdirSync(profilesDir).forEach(fileName => {
        const profile = require(path.join(profilesDir, fileName));

        profile.accountId = accountId;
        profile.created = new Date().toISOString();
        profile.updated = new Date().toISOString();

        profiles[profile.profileId] = profile;
    });

    return profiles;
}

async function validateProfile(profileId, profiles) {
    try {
        let profile = profiles.profiles[profileId];

        if (!profile || !profileId) throw new Error("Invalid profile/profileId");
    } catch {
        return false;
    }

    return true;
}

module.exports = {
    createProfiles,
    validateProfile
};
