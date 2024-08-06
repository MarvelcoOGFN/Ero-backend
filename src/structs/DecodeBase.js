const fs = require("fs"); //grr

function DecodeBase64(str) {
    return Buffer.from(str, 'base64').toString();
}


module.exports = {
    DecodeBase64
}