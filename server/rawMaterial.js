const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
    id: { type: Number, required: true, index: true },
    name: { type: String, required: true },
});

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

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
    { id: 10, name: "RM - 501 Settler" },
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



async function saveRawMaterials() {
    for (const rawMaterial of rawMaterials) {
        try {
            const newRawMaterial = new RawMaterial(rawMaterial);
            await newRawMaterial.save();
            console.log(`Raw material ${rawMaterial.name} saved to the database.`);
        } catch (error) {
            console.error(`Error saving raw material ${rawMaterial.name}:`, error.message);
        }
    }
}

module.exports = rawMaterials;

// Call the function to save raw materials
saveRawMaterials();