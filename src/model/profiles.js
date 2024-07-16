const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    created: { type: Date, required: true },
    accountId: { type: String, required: true, unique: true },
    profiles: { type: Object, required: true }
}, { collection: "profiles" });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
