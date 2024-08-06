const SaCCodes = require("../model/saccodes.js");


async function createSAC(code, accountId, creator) {
    if (!code || !accountId) return {message: "Code or Owner is required.", status: 400 };

    if (await SaCCodes.findOne({ code })) return { message: "That Code already exist!", status: 400}; 

    const accountIdprofile = (await User.findOne({ accountId }))
    if (accountIdprofile === null) return { message: "That User dosent exist!", status: 400};

    if (await SaCCodes.findOne({ owner: accountId })) return { message: "That User already has an Code!", status: 400};
    const creatorprofile = (await User.findOne({ discordId: creator }))

    const allowedCharacters = ("!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("");
    for (let character of allowedCharacters) {
        if (!allowedCharacters.includes(character)) return { message: "The Code has special Characters!", status: 400 };
    }

    try {
        await SaCCodes.create({ created: new Date().toISOString(), createdby: creatorprofile.accountId, owner: accountIdprofile.accountId , code, code_lower: code.toLowerCase()})
    } catch (error) {
        return { message: error, status: 400}
    }

    return { message: "You successfully created an Support-a-Creator Code!", status: 200}
}

module.exports = {
    createSAC,
}