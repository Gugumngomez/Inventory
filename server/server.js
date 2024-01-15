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
    rawMaterial: { type: Object, required: true },
    entries: [entrySchema],
});

const Inventory = mongoose.model('Inventory', inventoryShema);

const rawMaterials = [
    { id: 1, name: "RM - 004 Scrap Ext" },
    { id: 2, name: "RM - 010 Scrap Ext" },
    { id: 3, name: "RM - 100 Scrap" },
    { id: 4, name: "RM - 100 Starter Bars" },
    { id: 5, name: "RM - 101 Settler" },
    { id: 6, name: "RM - 304 Scrap Ext" },
    { id: 7, name: "RM - 319 Scrap Ext" },
    { id: 8, name: "RM - 400 Scrap" },
    { id: 9, name: "RM - 500 Scrap" },
    { id: 0, name: "RM - 501 Settler" },
    { id: 11, name: "RM - 600 Scrap" },
    { id: 12, name: "RM - 622" },
    { id: 13, name: "RM - 631" },
    { id: 14, name: "RM - 632" },
    { id: 15, name: "RM - 633" },
    { id: 16, name: "RM - 645" },
    { id: 17, name: "RM - 648" },
    { id: 18, name: "RM - 661 Ext" },
    { id: 19, name: "RM - 675" },
    { id: 20, name: "RM - 681 Ext" },
    { id: 21, name: "RM - 685" },
    { id: 22, name: "RM - 686" },
    { id: 23, name: "RM - 687" },
    { id: 24, name: "RM - 689" },
    { id: 25, name: "RM - 693 Ext" },
    { id: 26, name: "RM - 694 Ext" },
    { id: 27, name: "RM - 696 Ext" },
    { id: 28, name: "RM - 671 Settler" },
];

// Api endpoint
app.post('/api/inventory', async (req, res) => {
    try {
        const newEntry = new Inventory(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error saving inventory entry:', error);
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
});

app.get('/api/rawMaterials', async (req, res) => {
    try {
        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/rawMaterials/:name/entries', async (req, res) => {
    try {
        const name = req.params.name;
        // Assuming raw materials are stored in an array for simplicity
        const rawMaterial = await Inventory.findOne({ 'rawMaterial.name': name });
        if (!rawMaterial) {
            return res.status(404).json({ error: 'Raw material not found' });
        }
        res.status(200).json(rawMaterial.entries);
    } catch (error) {
        console.error('Error fetching raw material:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})