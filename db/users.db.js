const conn = require('./connection.db.js');
const Schema = require('mongoose').Schema;

const schema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date
    },
    dob: {
        type: Date
    },
    institute: {
        type: String
    },
    standard: {
        type: String
    }
});

const model = conn.model('users', schema);

module.exports = model;
