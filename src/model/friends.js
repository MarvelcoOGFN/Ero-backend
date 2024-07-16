const mongoose = require("mongoose");

// Define the schema for the 'friends' collection
const friendsSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true
    },
    accountId: {
        type: String,
        required: true,
        unique: true
    },
    list: {
        type: Object,
        default: {
            accepted: [],
            incoming: [],
            outgoing: [],
            blocked: []
        }
    }
}, {
    collection: "friends" // Specify the collection name
});

// Create the Friend model based on the schema
const Friend = mongoose.model('Friend', friendsSchema);

// Export the Friend model
module.exports = Friend;
