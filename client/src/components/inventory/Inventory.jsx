import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';

const Inventory = () => {
    const [formData, setFormData] = useState({
        date: parseISO(new Date().toISOString().split('T')[0]),
        inStock: 0,
        stockReceived: 0,
        stockUsed: 0,
    });
    const [inventoryData, setInventoryData] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedRawMaterial, setSelectedRawMaterial] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:4040/api/inventory')
                setInventoryData(res.data);

                const uniqueItemCodes = [...new Set(res.data.map(entry => entry.rawMaterial))]
                setRawMaterials(uniqueItemCodes);
                console.log(uniqueItemCodes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                const res = await axios.get('http://localhost:4040/api/rawMaterials');
                setRawMaterials(res.data);
                console.log(res.data);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            }
        };

        fetchRawMaterials();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        try {
            const stockBalance = calculateStockBalance();
            const newInventoryEntry = { ...formData, stockBalance, rawMaterial: selectedRawMaterial };

            // Save data to the server
            await axios.post('http://localhost:4040/api/inventory', newInventoryEntry);

            // Update local state for display
            const response = await axios.get('http://localhost:4040/api/inventory');
            setInventoryData(response.data);


            // Reset the form
            setFormData({
                date: parseISO(new Date().toISOString().split('T')[0]),
                inStock: 0,
                stockReceived: 0,
                stockUsed: 0,
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleItemCodeChange = async (selectedCode) => {
        setSelectedRawMaterial(selectedCode);
    };

    return (
        <div className='m-5'>
            <h1 className='text-4xl font-bold text-center pb-6'>Raw Material{' '} <select
                value={selectedRawMaterial}
                onChange={(e) => handleItemCodeChange(e.target.value)}
            >
                <option value=''>Select RM</option>
                {rawMaterials.map((code, index) => (
                    <option key={index} value={code}>
                        {code}
                    </option>
                ))}
            </select></h1>
            <div className='mb-6'>
                <form onSubmit={handleSubmit}>
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
                            {inventoryData.map((entry, index) => (
                                <tr key={index}>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.date}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.inStock}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockReceived}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockUsed}</td>
                                    <td className='border border-gray-300 p-2 text-center text-lg'>{entry.stockBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='mt-4'>
                        <DatePicker
                            selected={formData.date}
                            onChange={(date) => setFormData({ ...formData, date })}
                        />
                        <input type='number' name='inStock' value={formData.inStock} onChange={handleInputChange} />
                        <input type='number' name='stockReceived' value={formData.stockReceived} onChange={handleInputChange} />
                        <input type='number' name='stockUsed' value={formData.stockUsed} onChange={handleInputChange} />
                        <button type='submit'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Inventory;
