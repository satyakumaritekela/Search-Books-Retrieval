const express = require('express')
const router = express.Router()
const http = require('http');
const fs = require('fs');

var searchLog = [];
var keywordArray = [];
var frequency;
var booksJson = []

function search(array, single_element) {
    frequency = 0;
    array.forEach(element => {
        if (single_element == element) {
            frequency = frequency + 1;
        }
    });
    return frequency;
}

router.post('/search', (request) => {
    var response = request.body;
    keywordArray.push(response.keyword);
    var frequency_search = search(keywordArray, response.keyword);
    searchLog.push({
        'keyword': response.keyword,
        'time': response.dateNow,
        'frequency': frequency_search
    })
    updatejson(searchLog);
})

function updatejson(data) { 
    fs.writeFile("searchlog.json", JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }     
    });
}

module.exports = router;