const mongoose = require('mongoose');

const rawMaterialsSchema = new mongoose.Schema({
    itemNumber: String,
    itemName: String,
    materialType: {
        type: String,
        enum: ['Copper', 'Brass'],
        required: true
    },
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