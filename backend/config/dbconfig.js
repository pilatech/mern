const mongoose = require('mongoose');
require('dotenv').config()

async function dbCon() {
 return mongoose.connect(process.env.DB_STRING);
}

module.exports = dbCon