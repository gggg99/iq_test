const mongoose = require('mongoose');
const config = require('../config')
const uri = config.mongooseUri;

mongoose.connect(uri, {   useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error in connecting to database','error'));

db.once('open',function()
{
    console.log("Connected to Database :DB");
});

module.exports = db;