const express = require('express');
const router = express.Router();
const Content = require("../structs/ContentPage.js");

router.get("/content/api/pages/*", async (req, res) => {
    const contentpages = Content.ContentPages(req);

    res.json(contentpages);
});

module.exports = router;
