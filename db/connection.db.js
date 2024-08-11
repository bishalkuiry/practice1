const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb+srv://doadmin:90V2l5MH1ZvE8W46@dev2-mongodb-5dc34c34.mongo.ondigitalocean.com/social-network?tls=true&authSource=admin');

db.on('connected', () => console.log('MongoDB connected'));
db.on('open', () => console.log('MongoDB connection opened'));
db.on('disconnected', () => console.log('MongoDB disconnected'));
db.on('reconnected', () => console.log('MongoDB reconnected'));
db.on('disconnecting', () => console.log('MongoDB disconnecting'));
db.on('close', () => console.log('MongoDB connection closed'));

module.exports = db;