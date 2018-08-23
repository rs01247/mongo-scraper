const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const router = express.Router();

// GET ROUTE FOR SCRAPING REDDIT
router.get('/scrape', function (req, res) {
    axios.get('https://www.old.reddit.com/')
    .then(function (resp){

        // LOAD RESPONSE INTO CHEERIO AND SAVE AS '$'
        const $ = cheerio.load(resp.data); 

        // GRAB EVERY DIV W/ 'spacer' TAG
        $('spacer div').each(function(i, elem) {
            const result = {};


        })
    })
})

module.exports = router;