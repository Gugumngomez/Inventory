import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [materialData, setMaterialData] = useState([]);


    // State variables for input data
    const [inStock, setInStock] = useState('');
    const [stockReceived, setStockReceived] = useState('');
    const [stockUsed, setStockUsed] = useState('');
    const [stockBalance, setStockBalance] = useState('');


    useEffect(() => {
        // Fetch raw materials from the server
        axios.get('http://localhost:4040/api/rawmaterials')
            .then(response => setRawMaterials(response.data))
            .catch(error => console.error(error));
    }, []);


    const handleMaterialChange = async (materialId) => {
        // Fetch data for the selected raw material
        try {
            const response = await axios.get(`http://localhost:4040/api/rawmaterials/${materialId}`);
            setMaterialData(response.data.entry);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputData = async () => {
        // Convert input values to numbers
        const inStockValue = parseFloat(inStock);
        const stockReceivedValue = parseFloat(stockReceived);
        const stockUsedValue = parseFloat(stockUsed);

        // Calculate stockBalance
        const stockBalanceValue = inStockValue + stockReceivedValue - stockUsedValue;

        // Create an object with input data
        const inputData = {
            inStock: inStockValue,
            stockReceived: stockReceivedValue,
            stockUsed: stockUsedValue,
            stockBalance: stockBalanceValue,
        };

        try {
            await axios.post(`http://localhost:4040/api/rawMaterials/${selectedMaterial}/entry`, inputData);
            // Refresh data after submitting
            handleMaterialChange(selectedMaterial);

            // Clear input fields
            setInStock('');
            setStockReceived('');
            setStockUsed('');
            setStockBalance('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <label>Select Raw Material:</label>
            <select onChange={(e) => { setSelectedMaterial(e.target.value); handleMaterialChange(e.target.value); }}>
                <option value="">Select...</option>
                {rawMaterials.map(material => (
                    <option key={material._id} value={material._id}>
                        {material.name}
                    </option>
                ))}
            </select>

            {selectedMaterial && (
                <div>
                    <h3>Data for {selectedMaterial}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>In Stock</th>
                                <th>Stock Received</th>
                                <th>Stock Used</th>
                                <th>Stock Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materialData?.map(entry => (
                                <tr key={entry._id}>
                                    <td>{entry.date}</td>
                                    <td>{entry.inStock}</td>
                                    <td>{entry.stockReceived}</td>
                                    <td>{entry.stockUsed}</td>
                                    <td>{entry.stockBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <form onSubmit={handleInputData}>
                        <label>
                            In Stock:
                            <input type="number" value={inStock} onChange={(e) => setInStock(e.target.value)} />
                        </label>
                        <label>
                            Stock Received:
                            <input type="number" value={stockReceived} onChange={(e) => setStockReceived(e.target.value)} />
                        </label>
                        <label>
                            Stock Used:
                            <input type="number" value={stockUsed} onChange={(e) => setStockUsed(e.target.value)} />
                        </label>
                        <label>
                            Stock Balance:
                            <input type="number" value={stockBalance} onChange={(e) => setStockBalance(e.target.value)} />
                        </label>
                        <button type="submit">Submit Data</button>
                    </form>
                </div>
            )}
        </div>
    );
};


export default Inventory;
