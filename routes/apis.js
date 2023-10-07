__path = process.cwd();

require('../settings.js');
var express = require('express');
var axios = require('axios');
var fetch = require('node-fetch');
var request = require('request');
var fs = require('fs');
var router = express.Router();
var creator = global.creator
const {
    limitAdd,
    isLimit,
    cekKey,
    checkLimit
} = require('../MongoDB/function');

const scr = require('@bochilteam/scraper')
const {
    color,
    bgcolor
} = require(__path + '/lib/color.js');
const {
    fetchJson
} = require(__path + '/lib/fetcher.js')
const options = require(__path + '/lib/options.js');
const {
    getBuffer
} = require(__path + '/lib/functions.js');
const oxy = require(__path + '/lib/oxy.js');
// search api

router.get('/other/chatai', async (req, res, next) => {
    var apikey = req.query.apikey
    var text = req.query.query
    if (!apikey) return res.json(loghandler.noapikey)
    if (!text) return res.json({
        status: false,
        creator: `${creator}`,
        message: "masukan parameter query"
    })
    const check = await cekKey(apikey);
    if (!check) return res.status(403).send({
        status: 403,
        message: `apikey ${apikey} not found, please register first! https://${req.hostname}/users/signup`,
        result: "error"
    });
    let limit = await isLimit(apikey);
    if (limit) return res.status(403).send({
        status: 403,
        message: 'your limit has been exhausted, reset every 12 PM'
    });

    try {
        const configuration = new Configuration({
            apiKey: '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',
        });

        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${text}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        var result = {
            "bot": response.data.choices[0].text
        }

        res.status(200).send(result);
        limitAdd(apikey);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error
        });
    }
});



module.exports = router