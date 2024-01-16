const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rawMaterials = require('./rawMaterial');

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
}, {_id: false});

const inventoryShema = new mongoose.Schema({
    rawMaterial: { type: Object, required: true },
    entries: [entrySchema],
}, { versionKey: false });

const Inventory = mongoose.model('Inventory', inventoryShema);


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
        const rawMaterial = await Inventory.findOne({ 'rawMaterial.name': name});

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