const express = require("express");
const router = express.Router();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const { verifyToken } = require("../token/tokenVerify.js");
const Version = require("../structs/Versioninfo.js");

let seasons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

router.get("/fortnite/api/cloudstorage/system", handleCloudStorageSystem);
router.get("/fortnite/api/cloudstorage/system/:file", handleCloudStorageFile);
router.get("/fortnite/api/cloudstorage/user/*/:file", verifyToken, handleUserFile);
router.get("/fortnite/api/cloudstorage/user/:accountId", verifyToken, handleUserAccount);
router.put("/fortnite/api/cloudstorage/user/*/:file", verifyToken, getRawBody, handlePutUserFile);

function handleCloudStorageSystem(req, res) {
    const cloudFiles = getCloudFiles();
    res.json(cloudFiles);
}

function handleCloudStorageFile(req, res) {
    const file = path.join(__dirname, "..", "CloudStorage", req.params.file);

    if (fs.existsSync(file)) {
        res.status(200).send(fs.readFileSync(file));
    } else {
        res.status(200).end();
    }
}

function handleUserFile(req, res) {
    const clientSettingsPath = getClientSettingsPath(req);

    if (req.params.file.toLowerCase() !== "clientsettings.sav") {
        return res.status(200).end();
    }

    const memory = Version.GetVersionInfo(req);

    if (!seasons.includes(memory.season)) {
        return res.status(200).end();
    }

    const file = getUserFilePath(clientSettingsPath, memory.season);
    sendFileIfExists(file, res);
}

function handleUserAccount(req, res) {
    const clientSettingsPath = getClientSettingsPath(req);
    const memory = Version.GetVersionInfo(req);

    if (!seasons.includes(memory.season)) {
        return res.json([]);
    }

    const file = getUserFilePath(clientSettingsPath, memory.season);
    sendFileDetailsIfExists(file, res, req.user.accountId);
}

function handlePutUserFile(req, res) {
    if (Buffer.byteLength(req.rawBody) >= 400000) {
        return res.status(403).json({ error: "File size must be less than 400kb." });
    }

    const clientSettingsPath = getClientSettingsPath(req);

    if (req.params.file.toLowerCase() !== "clientsettings.sav") {
        return res.status(204).end();
    }

    const memory = Version.GetVersionInfo(req);

    if (!seasons.includes(memory.season)) {
        return res.status(204).end();
    }

    const file = getUserFilePath(clientSettingsPath, memory.season);
    writeFileSync(file, req.rawBody, 'latin1');

    res.status(204).end();
}

function getCloudFiles() {
    return fs.readdirSync(path.join(__dirname, "..", "CloudStorage"))
        .filter(name => name.toLowerCase().endsWith(".ini"))
        .map(name => parseCloudFile(name));
}

function parseCloudFile(name) {
    const parsedFile = fs.readFileSync(path.join(__dirname, "..", "CloudStorage", name)).toString();
    const parsedStats = fs.statSync(path.join(__dirname, "..", "CloudStorage", name));

    return {
        uniqueFilename: name,
        filename: name,
        hash: crypto.createHash('sha1').update(parsedFile).digest('hex'),
        hash256: crypto.createHash('sha256').update(parsedFile).digest('hex'),
        length: parsedFile.length,
        contentType: "application/octet-stream",
        uploaded: parsedStats.mtime,
        storageType: "S3",
        storageIds: {},
        doNotCache: true
    };
}

function getClientSettingsPath(req) {
    const accountId = req.user.accountId;
    const clientSettingsPath = path.join(__dirname, "..", "ClientSettings", accountId);

    if (!fs.existsSync(clientSettingsPath)) {
        fs.mkdirSync(clientSettingsPath);
    }

    return clientSettingsPath;
}

function getUserFilePath(clientSettingsPath, season) {
    return path.join(clientSettingsPath, `ClientSettings-${season}.Sav`);
}

function sendFileIfExists(file, res) {
    if (fs.existsSync(file)) {
        res.status(200).send(fs.readFileSync(file));
    } else {
        res.status(200).end();
    }
}

function sendFileDetailsIfExists(file, res, accountId) {
    if (fs.existsSync(file)) {
        const parsedFile = fs.readFileSync(file, 'latin1');
        const parsedStats = fs.statSync(file);

        const response = [{
            uniqueFilename: "ClientSettings.Sav",
            filename: "ClientSettings.Sav",
            hash: crypto.createHash('sha1').update(parsedFile).digest('hex'),
            hash256: crypto.createHash('sha256').update(parsedFile).digest('hex'),
            length: Buffer.byteLength(parsedFile),
            contentType: "application/octet-stream",
            uploaded: parsedStats.mtime,
            storageType: "S3",
            storageIds: {},
            accountId: accountId,
            doNotCache: false
        }];

        res.json(response);
    } else {
        res.json([]);
    }
}

function writeFileSync(file, content, encoding) {
    fs.writeFileSync(file, content, encoding);
}

function getRawBody(req, res, next) {
    if (req.headers["content-length"] && Number(req.headers["content-length"]) >= 400000) {
        return res.status(403).json({ error: "File size must be less than 400kb." });
    }

    try {
        req.rawBody = "";
        req.setEncoding("latin1");

        req.on("data", (chunk) => req.rawBody += chunk);
        req.on("end", () => next());
    } catch {
        res.status(400).json({ error: "Something went wrong while trying to access the request body." });
    }
}

module.exports = router;
