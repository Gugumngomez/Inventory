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

const rawMaterials = [
    {
        "id": 1,
        "itemNumber": "RM - 004 SCRAP EXT",
        "itemName": "004 SCRAP EXT",
        "materialType": "Copper",
        "entry": []
    },
    {
        "id": 2,
        "itemNumber": "RM - 004 SCRAP EXT",
        "itemName": "004 SCRAP EXT",
        "materialType": "Brass",
        "entry": []
    },
    {
        "id": 3,
        "itemNumber": "RM - 008 SCRAP",
        "itemName": "004 SCRAP",
        "materialType": "Copper",
        "entry": []
    },
    {
        "id": 4,
        "itemNumber": "RM - 010 SCRAP EXT",
        "itemName": "010 SCRAP EXT",
        "materialType": "Copper",
        "entry": []
    },
    {
        "id": 5,
        "itemNumber": "RM - 100 SCRAP",
        "itemName": "100 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 6,
        "itemNumber": "RM - 100 STARTER BARS",
        "itemName": "100 STARTER BARS",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 7,
        "itemNumber": "RM - 101 SETTLER",
        "itemName": "101 SETTLER",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 8,
        "itemNumber": "RM - 213 SETTLER",
        "itemName": "213 SETTLER",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 9,
        "itemNumber": "RM - 312 SCRAP",
        "itemName": "319 SCRAP",
        "materialType": "Copper",
        "entry": [

        ]
    },
    {
        "id": 10,
        "itemNumber": "RM - 319 SCRAP EXT",
        "itemName": "319 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 11,
        "itemNumber": "RM - 400 SCRAP",
        "itemName": "400 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 12,
        "itemNumber": "RM - 500 SCRAP",
        "itemName": "500 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 13,
        "itemNumber": "RM - 501 SETTLER",
        "itemName": "501 SETTLER",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 14,
        "itemNumber": "RM - 600 SCRAP",
        "itemName": "600 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 15,
        "itemNumber": "RM - 621",
        "itemName": "SHINY BRIGHT COPPER SCRAP",
        "materialType": "Copper",
        "entry": [

        ]
    },
    {
        "id": 16,
        "itemNumber": "RM - 622",
        "itemName": "No 1 A COPPER SCRAP",
        "materialType": "Copper",
        "entry": [

        ]
    },
    {
        "id": 17,
        "itemNumber": "RM - 622 EXT",
        "itemName": "622 EXT",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 18,
        "itemNumber": "RM - 631",
        "itemName": "BRASS ROD SCRAP 60/40",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 19,
        "itemNumber": "RM - 632",
        "itemName": "BRASS ROLLED SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 20,
        "itemNumber": "RM - 633",
        "itemName": "BRASS SWARF",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 21,
        "itemNumber": "RM - 645",
        "itemName": "HEAVY BRASS SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 22,
        "itemNumber": "RM - 648",
        "itemName": "COPPER ZIRCONIUM MASTER ALLOY",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 23,
        "itemNumber": "RM - 661 EXT",
        "itemName": "VIRGIN ZINC ZN1 SHG",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 24,
        "itemNumber": "RM - 675",
        "itemName": "ALUMINIUM",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 25,
        "itemNumber": "RM - 681 EXT",
        "itemName": "ARSENIC METAL",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 26,
        "itemNumber": "RM - 685",
        "itemName": "MANGANESE FLAKES",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 27,
        "itemNumber": "RM - 686",
        "itemName": "LEAD INGOT",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 28,
        "itemNumber": "RM - 687",
        "itemName": "MAGNESIUM",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 29,
        "itemNumber": "RM - 689",
        "itemName": "SILICON METAL",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 30,
        "itemNumber": "RM - 693 EXT",
        "itemName": "VIRGIN TIN",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 31,
        "itemNumber": "RM - 694 EXT",
        "itemName": "NICKEL CATHODE",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 32,
        "itemNumber": "RM - 696 EXT",
        "itemName": "CHROME METAL",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 33,
        "itemNumber": "RM - 925 SCRAP",
        "itemName": "925 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 34,
        "itemNumber": "RM - 931 EXT",
        "itemName": "931 EXT",
        "materialType": "Brass",
        "entry": [

        ]
    },
    {
        "id": 35,
        "itemNumber": "RM - 960",
        "itemName": "PHOS COPPER TEMPER",
        "materialType": "Copper",
        "entry": [

        ]
    },
    {
        "id": 36,
        "itemNumber": "RM - 971 SCRAP",
        "itemName": "971 SCRAP",
        "materialType": "Brass",
        "entry": [

        ]
    }
];

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