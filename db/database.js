const mongoose = require('mongoose');

require('dotenv').config();


const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    dbName: process.env.COSMOSDB_DBNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const User = connection.model('User', UserSchema);

module.exports = connection;