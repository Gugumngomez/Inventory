import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

const Inventory = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('65a63e409e4ff172aef6220b');
    const [materialData, setMaterialData] = useState([]);


    // State variables for input data
    const [formData, setFormData] = useState({
        date: parseISO(new Date().toISOString().split('T')[0]),
        inStock: 0,
        stockReceived: 0,
        stockUsed: 0,
        stockBalance: 0,
    });


    useEffect(() => {
        // Fetch raw materials from the server
        axios.get('http://localhost:4040/api/rawmaterials')
            .then(response => setRawMaterials(response.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        // Fetch data for the selected raw material
        handleMaterialChange(selectedMaterial);
    }, [selectedMaterial]);

    const handleMaterialChange = async (materialId) => {
        // Fetch data for the selected raw material
        try {
            const response = await axios.get(`http://localhost:4040/api/rawmaterials/${materialId}`);
            setMaterialData(response.data.entry);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateStockBalance = () => {
        return (
            parseInt(formData.inStock) +
            parseInt(formData.stockReceived) -
            parseInt(formData.stockUsed)
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const stockBalance = calculateStockBalance();

        // Create an object with input data
        const inputData = {
            date: format(formData.date, 'yyyy-MM-dd'),
            inStock: formData.inStock,
            stockReceived: formData.stockReceived,
            stockUsed: formData.stockUsed,
            stockBalance: stockBalance,
        };

        try {
            await axios.post(`http://localhost:4040/api/rawMaterials/${selectedMaterial}/entry`, inputData);
            // Refresh data after submitting
            handleMaterialChange(selectedMaterial);

            // Clear input fields
            setFormData({
                date: parseISO(new Date().toISOString().split('T')[0]),
                inStock: 0,
                stockReceived: 0,
                stockUsed: 0,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='p-4'>
            <label>Select Raw Material:</label>
            <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className='border p-2 rounded'
            >
                <option value="">Select...</option>
                {rawMaterials.map(material => (
                    <option key={material._id} value={material._id}>
                        {material.name}
                    </option>
                ))}
            </select>

            {selectedMaterial && (
                <div className='mt-4'>
                    {/* <h3>Data for {selectedMaterial}</h3> */}
                    <table className='min-w-full border border-gray-300'>
                        <thead>
                            <tr>
                                <th className='border border-gray-300 p-2 text-xl'>Date</th>
                                <th className='border border-gray-300 p-2 text-xl'>In Stock</th>
                                <th className='border border-gray-300 p-2 text-xl'>Stock Received</th>
                                <th className='border border-gray-300 p-2 text-xl'>Stock Used</th>
                                <th className='border border-gray-300 p-2 text-xl'>Stock Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materialData?.map(entry => (
                                <tr key={entry._id}>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{format(parseISO(entry.date), 'yyyy-MM-dd')}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.inStock}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockReceived}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockUsed}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2">
                            Date:
                            <DatePicker
                                selected={formData.date}
                                onChange={(date) => setFormData({ ...formData, date })}
                            />
                        </label>
                        <label className="block mb-2">
                            In Stock:
                            <input type="number" value={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.value })} />
                        </label>
                        <label className="block mb-2">
                            Stock Received:
                            <input type="number" value={formData.stockReceived} onChange={(e) => setFormData({ ...formData, stockReceived: e.target.value })} />
                        </label>
                        <label className="block mb-2">
                            Stock Used:
                            <input type="number" value={formData.stockUsed} onChange={(e) => setFormData({ ...formData, stockUsed: e.target.value })} />
                        </label>
                        <button type="submit">Submit Data</button>
                    </form>
                </div>
            )}
        </div>
    );
};


export default Inventory;
