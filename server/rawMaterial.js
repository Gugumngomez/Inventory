const mongoose = require('mongoose');

const rawMaterialsSchema = new mongoose.Schema({
    name: String,
    entry: [
        {
            date: {type: Date, default: Date.now},
            inStock: Number,
            stockReceived: Number,
            stockUsed: Number,
            stockBalance: Number,
        }

    ]
});

const RawMaterial = mongoose.model('RawMaterial', rawMaterialsSchema);

module.exports = RawMaterial;