const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const RawMaterial = require('./rawMaterial');

const app = express();

const PORT = process.env.PORT || 4040;

app.use(cors());

app.use(bodyParser.json());

// connect to MongoDB
mongoose.connect("mongodb+srv://gugulethu:Superman1!@atlascluster.kvdittq.mongodb.net/inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.get('/api/rawMaterials', async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find();
        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/materialProperties', async (req, res) => {
    try {
        const rawMaterials = [
            { name: "RM - 004 Scrap Ext", entry: [] },
            { name: "RM - 010 Scrap Ext", entry: [] },
            { name: "RM - 100 Scrap", entry: [] },
            { name: "RM - 100 Starter Bars", entry: [] },
            { name: "RM - 101 Settler", entry: [] },
            { name: "RM - 304 Scrap Ext", entry: [] },
            { name: "RM - 319 Scrap Ext", entry: [] },
            { name: "RM - 400 Scrap", entry: [] },
            { name: "RM - 500 Scrap", entry: [] },
            { name: "RM - 501 Settler", entry: [] },
            { name: "RM - 600 Scrap", entry: [] },
            { name: "RM - 622", entry: [] },
            { name: "RM - 631", entry: [] },
            { name: "RM - 632", entry: [] },
            { name: "RM - 633", entry: [] },
            { name: "RM - 645", entry: [] },
            { name: "RM - 648", entry: [] },
            { name: "RM - 661 Ext", entry: [] },
            { name: "RM - 675", entry: [] },
            { name: "RM - 681 Ext", entry: [] },
            { name: "RM - 685", entry: [] },
            { name: "RM - 686", entry: [] },
            { name: "RM - 687", entry: [] },
            { name: "RM - 689", entry: [] },
            { name: "RM - 693 Ext", entry: [] },
            { name: "RM - 694 Ext", entry: [] },
            { name: "RM - 696 Ext", entry: [] },
            { name: "RM - 671 Settler", entry: [] },
        ];


        
        for (const material of rawMaterials) {
            const existingMaterial = await RawMaterial.findOne({ name: material.name });
            if (!existingMaterial) {
                await RawMaterial.create(material);
            }
        }

        res.status(201).json({ message: 'Materials created successfully' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/rawmaterials/:id', async (req, res) => {
    const materialId = req.params.id;

    try {
        const rawMaterial = await RawMaterial.findById(materialId);
        res.status(200).json(rawMaterial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/rawMaterials/:id/entry', async (req, res) => {
    const materialId = req.params.id;
    const entryData = req.body;

    try {
        const updatedMaterial = await RawMaterial.findByIdAndUpdate(
            materialId,
            { $push: { entry: entryData } },
            { new: true }
        );

        res.status(201).json(updatedMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})