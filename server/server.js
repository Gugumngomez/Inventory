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
mongoose.connect("mongodb+srv://gugulethu:Superman1!@atlascluster.kvdittq.mongodb.net/Inventory1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// RawMaterial.insertMany(rawMaterials)
//     .then(() => {
//         console.log('Raw Materials added');
//         mongoose.connection.close();

//     })
//     .catch(err => {
//         console.error(err);
//         mongoose.connection.close();
//     });

// app.get('/api/rawMaterials', async (req, res) => {
//     try {
//         const rawMaterials = await RawMaterial.find();
//         res.status(200).json(rawMaterials);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// GET: Retrieve all raw materials, optionally filtered by materialType
app.get('/api/rawMaterials', async (req, res) => {
    const { materialType } = req.query; // optional query parameter

    try {
        const filter = materialType ? { materialType } : {};
        const rawMaterials = await RawMaterial.find(filter);

        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Add new raw material 
app.post('/api/rawMaterials', async (req, res) => {
    const { itemNumber, itemName, materialType } = req.body;

    try {
        const newMaterial = new RawMaterial({
            itemNumber,
            itemName,
            materialType,
            entry: []
        });

        await newMaterial.save();
        res.status(201).json(newMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });

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


// Add a new route for editing a raw material entry
app.put('/api/rawMaterials/:materialId/entry/:entryId/edit', async (req, res) => {
    const materialId = req.params.materialId;
    const entryId = req.params.entryId;
    const updatedData = req.body;

    try {
        const updatedMaterial = await RawMaterial.findOneAndUpdate(
            { _id: materialId, 'entry._id': entryId },
            {
                $set: {
                    'entry.$.date': updatedData.date,
                    'entry.$.inStock': updatedData.inStock,
                    'entry.$.stockReceived': updatedData.stockReceived,
                    'entry.$.stockUsed': updatedData.stockUsed,
                    'entry.$.stockBalance': updatedData.stockBalance,
                },
            },
            { new: true }
        );

        res.status(200).json(updatedMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/rawMaterials/:id/entry/:entryId/delete', async (req, res) => {
    const { id: materialId, entryId } = req.params;

    try {
        // Find the raw material by ID
        const rawMaterial = await RawMaterial.findById(materialId);

        // Remove the entry with the specified ID
        rawMaterial.entry.pull({ _id: entryId });

        // Save the updated raw material
        await rawMaterial.save();

        res.status(204).send();  // No content response for successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})