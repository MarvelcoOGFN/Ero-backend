const fs = require("fs");


function UpdateTokens() {
    fs.writeFileSync("./src/token/tokens.json", JSON.stringify({
        accessTokens: global.accessTokens,
        refreshTokens: global.refreshTokens,
        clientTokens: global.clientTokens
    }, null, 2));
}

module.exports = {
    UpdateTokens
}