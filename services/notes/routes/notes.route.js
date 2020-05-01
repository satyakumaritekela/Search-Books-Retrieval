const express = require('express')
const router = express.Router()
const http = require('http');
const fs = require('fs');

var notesLog = [];
var notesRes = [];

router.post('/notes', (request) => {
    var response = request.body;
    notesLog.push({
        'keyword': response.keyword,
        'notes': response.text
    })
    updatejson(notesLog);
})

router.get('/note/:keywordName', (request, response) => {
    fs.readFile('notesLog.json', 'utf8', function readFileCallback(error, data){
        if(error){
            console.log(error);
        }
        else {
            notesRes = [];
            jsonObj = JSON.parse(data);
            jsonObj.forEach(note => {
                if (note.keyword == request.params.keywordName) {
                    notesRes.push(note);
                }
            });
            response.json(notesRes);
        }
    });
})

function updatejson(data) { 
    fs.writeFile("notesLog.json", JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }     
        console.log("JSON file has been saved.");
    });
}

module.exports = router;