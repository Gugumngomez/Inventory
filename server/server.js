const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4040;

app.use(cors());

app.use(bodyParser.json());

// connect to MongoDB
mongoose.connect("mongodb+srv://gugulethu:Superman1!@atlascluster.kvdittq.mongodb.net/inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schema and model

const entrySchema = new mongoose.Schema({
    date: { type: String, required: true },
    stockUsed: { type: Number, required: true },
    stockBalance: { type: Number, required: true },
    stockReceived: { type: Number, required: true },
})

const inventoryShema = new mongoose.Schema({
    rawMaterial: { type: String, required: true },
    entries: [entrySchema],
});

const Inventory = mongoose.model('Inventory', inventoryShema);

// Api endpoint
app.post('/api/inventory', async (req, res) => {
    try {
        const newEntry = new Inventory(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const inventoryData = await Inventory.find();
        res.status(200).json(inventoryData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/api/rawMaterials', async (req, res) => {
    try {
        const rawMaterials = [
            "RM - 004 Scrap Ext",
            "RM - 010 Scrap Ext",
            "RM - 100 Scrap",
            "RM - 100 Starter Bars",
            "RM - 101 Settler",
            "RM - 304 Scrap Ext",
            "RM - 319 Scrap Ext",
            "RM - 400 Scrap",
            "RM - 500 Scrap",
            "RM - 501 Settler",
            "RM - 600 Scrap",
            "RM - 622",
            "RM - 631",
            "RM - 632",
            "RM - 633",
            "RM - 645",
            "RM - 648",
            "RM - 661 Ext",
            "RM - 675",
            "RM - 681 Ext",
            "RM - 685",
            "RM - 686",
            "RM - 687",
            "RM - 689",
            "RM - 693 Ext",
            "RM - 694 Ext",
            "RM - 696 Ext",
            "RM - 671 Settler",
        ];
        res.status(200).json(rawMaterials)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})