const mongoose = require('mongoose');
const equipmentSchema = new mongoose.Schema({
        name:String
})

const equipment = new mongoose.model('equipment',equipmentSchema);
module.exports = equipment;