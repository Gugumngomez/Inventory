import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { useNavigate } from 'react-router-dom'

const Inventory = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('65af7d9aecda7317b4c804a3');
    const [materialData, setMaterialData] = useState([]);
    const [latestStockBalance, setLatestStockBalance] = useState(0);
    const [displayedMaterials, setDisplayedMaterials] = useState(10);
    const navigate = useNavigate();
    const [viewAll, setViewAll] = useState(false);
    // State variables for input data
    const [formData, setFormData] = useState({
        date: parseISO(new Date().toISOString().split('T')[0]),
        inStock: 0,
        stockReceived: 0,
        stockUsed: 0,
        stockBalance: 0,
    });

    const [isAddStockOpen, setIsAddStockOpen] = useState(false);

    const openAddStock = () => {
        const lastEntry = materialData.length > 0 ? materialData[materialData.length - 1] : null;

        if (lastEntry) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                inStock: lastEntry.stockBalance,
            }));
        } else {
            // If there are no entries, set inStock to 0 or any default value
            setFormData((prevFormData) => ({
                ...prevFormData,
                inStock: 0,
            }));
        }

        setIsAddStockOpen(true);
    };

    const closeAddStock = () => {
        setIsAddStockOpen(false);
    };

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
            const response = await axios.get(`http://localhost:4040/api/rawMaterials/${materialId}`);
            const materialEntries = response.data.entry;

            let yesterdayStockBalance = 0;

            if (materialEntries.length > 0) {
                const todayEntry = materialEntries.find(entry => {
                    const entryDate = new Date(entry.date).toDateString();
                    const todayDate = new Date().toDateString();
                    return entryDate === todayDate;
                });

                if (todayEntry) {
                    yesterdayStockBalance = todayEntry.stockBalance;
                } else {
                    yesterdayStockBalance = materialEntries[0].stockBalance; // Use the latest entry
                }
            }

            setLatestStockBalance(yesterdayStockBalance);

            // Update formData to set inStock to yesterday's stockBalance
            setFormData((prevFormData) => ({
                ...prevFormData,
                inStock: yesterdayStockBalance,
            }));

            setMaterialData(materialEntries);


        } catch (error) {
            console.error(error);
        }
    };

    const calculateStockBalance = () => {
        return (
            parseInt(formData.inStock === 0 ? latestStockBalance : formData.inStock) +
            parseInt(formData.stockReceived) -
            parseInt(formData.stockUsed)
        );
    }

    const handleViewAllToggle = () => {
        setViewAll(!viewAll);
        setDisplayedMaterials(viewAll ? 10 : rawMaterials.length);
    };

    const handleMaterialClick = (materialId) => {
        setSelectedMaterial(materialId);
        // Additional logic you might want to perform when a material is selected
    };

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

            closeAddStock();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='flex'>
            <div className='w-72 h-screen bg-gray-500 overflow-hidden text-white'>
                <div className='overflow-y-auto h-full'>
                    <h1 className='mt-3 pl-2 text-2xl'>Raw Materials:</h1>
                    <ol className='pl-2 mt-4'>
                        {rawMaterials.slice(0, displayedMaterials).map(material => (
                            <li
                                key={material._id}
                                onClick={() => handleMaterialClick(material._id)}
                                className={`cursor-pointer hover:bg-orange-900 mt-2 ${selectedMaterial === material._id ? 'bg-blue-500' : ''}`}
                            >
                                {material.itemNumber}
                            </li>
                        ))}
                    </ol>
                    <div className='flex justify-center items-center mt-2 text-xl'>
                        <button onClick={handleViewAllToggle} className='text-gray-900 underline cursor-pointer'>
                            {viewAll ? 'Less' : 'More'}
                        </button>
                    </div>
                    <div className='m-2 text-xl cursor-pointer' onClick={() => navigate('/summary')}>Summary</div>
                </div>
            </div>

            <div className='m-3 p-3 w-full'>
                <h1 className='mb-4 pb-2 text-5xl text-center font-bold'>Inventory Management</h1>

                <div >
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
                            <button onClick={openAddStock}
                                className={`mt-3 border p-1 rounded-md border-gray-300 ${isAddStockOpen ? 'hidden' : ''} `}
                            >
                                Add Stock
                            </button>
                        </div>

                    )}
                    {isAddStockOpen && (
                        <div className=''>
                            <div className='flex items-center justify-center'>
                                <form onSubmit={handleSubmit}
                                    className='mt-3 p-2 rounded-tl-lg shadow-2xl'
                                >
                                    <button
                                        onClick={closeAddStock}
                                        className='m-2 text-2xl'
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                    <label className="block m-8 relative">
                                        <DatePicker
                                            selected={formData.date}
                                            onChange={(date) => setFormData({ ...formData, date })}
                                            className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                            rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                        />
                                        <span className='absolute left-2 top-[-8px] px-1 text-sm uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                            Date:
                                        </span>
                                    </label>


                                    <label className="block m-8 relative">
                                        <input
                                            type="number"
                                            value={formData.inStock === 0 ? '' : formData.inStock}
                                            onChange={(e) => setFormData({ ...formData, inStock: e.target.value })}
                                            className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                            rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                        />
                                        <span className='absolute left-2 top-[-8px] px-1 text-lg uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                            In Stock:
                                        </span>
                                    </label>


                                    <label className="block m-8 relative">
                                        <input
                                            type="number"
                                            value={formData.stockReceived}
                                            onChange={(e) => setFormData({ ...formData, stockReceived: e.target.value })}
                                            className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                            rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                        />
                                        <span className='absolute left-2 top-[-8px] px-1 text-lg uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                            Stock Received:
                                        </span>
                                    </label>


                                    <label className="block m-8 relative">
                                        <input
                                            type="number"
                                            value={formData.stockUsed}
                                            onChange={(e) => setFormData({ ...formData, stockUsed: e.target.value })}
                                            className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                            rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                        />
                                        <span className='absolute left-2 top-[-8px] px-1 text-lg uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                            Stock Used:
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        className=' bg-gray-500 p-2 m-2 rounded-full'
                                    >
                                        Submit Data
                                    </button>
                                </form>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Inventory;
