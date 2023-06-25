const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender:String,
    receiver:String,
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});



const chat = mongoose.model("chat", chatSchema);

module.exports = chat;
