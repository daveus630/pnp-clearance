const mongoose = require('mongoose');



const visitorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: String,
    username: String,
    password: String,
    transactions: Array,
    schedule: String,
    
});

module.exports = mongoose.model('Visitor', visitorSchema);
