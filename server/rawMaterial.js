const mongoose = require('mongoose');

const rawMaterialsSchema = new mongoose.Schema({
    itemNumber: String,
    itemName: String,
    entry: [
        {
            date: Date,
            inStock: Number,
            stockReceived: Number,
            stockUsed: Number,
            stockBalance: Number,
        }

    ]
});

const RawMaterial = mongoose.model('RawMaterial', rawMaterialsSchema);

module.exports = RawMaterial;