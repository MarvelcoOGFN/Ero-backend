const uuid = require("uuid"); //well just making things look nice

function MakeID() {
    return uuid.v4();
}

module.exports = {
    MakeID
}