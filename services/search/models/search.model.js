const mongoose = require('mongoose')

const searchLogSchema = mongoose.Schema({
    'keyword': String,
    'time': Date
});

module.exports = mongoose.model('SearchLog', searchLogSchema);