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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editEntryId, setEditEntryId] = useState(null);
    // State variables for input data
    const [formData, setFormData] = useState({
        date: parseISO(new Date().toISOString().split('T')[0]),
        inStock: 0,
        stockReceived: 0,
        stockUsed: 0,
        stockBalance: 0,
    });

    const [isAddStockOpen, setIsAddStockOpen] = useState(false);
    const [showAdditionalInputReceived, setShowAdditionalInputReceived] = useState(false);
    const [additionalStockReceived, setAdditionalStockReceived] = useState(0);
    const [showAdditionalInputUsed, setShowAdditionalInputUsed] = useState(false);
    const [additionalStockUsed, setAdditionalStockUsed] = useState(0);
    const [selectedMaterialType, setSelectedMaterialType] = useState('Copper'); // Default to 'Copper'

    // Step 2: Filter raw materials based on the selected material type (Brass or Copper)
    const filteredMaterials = rawMaterials.filter(material => material.materialType === selectedMaterialType);
    const handleStockReceivedAddButtonClick = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            stockReceived: parseInt(prevFormData.stockReceived) + parseInt(additionalStockReceived),
        }));
        setShowAdditionalInputReceived(false);
        setAdditionalStockReceived(0);
    }

    const handleStockUsedAddButtonClick = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            stockUsed: parseInt(prevFormData.stockUsed) + parseInt(additionalStockUsed),
        }));
        setShowAdditionalInputUsed(false);
        setAdditionalStockUsed(0);
    }

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

    // stock calculations
    const calculateStockBalance = () => {
        return (
            parseInt(formData.inStock === 0 ? latestStockBalance : formData.inStock) +
            parseInt(formData.stockReceived) -
            parseInt(formData.stockUsed)
        );
    }

    const calculateEditedStockBalance = (entry) => {
        return (
            parseInt(entry.inStock) +
            parseInt(entry.stockReceived) -
            parseInt(entry.stockUsed)
        );
    }
    // viewing the rest of the materials
    const handleViewAllToggle = () => {
        setViewAll(!viewAll);
        setDisplayedMaterials(viewAll ? 10 : rawMaterials.length);
    };

    // editing the raw material data
    const handleMaterialClick = (materialId) => {
        setSelectedMaterial(materialId);
    };
    const openEditForm = (entryId) => {
        const entryToEdit = materialData.find((entry) => entry._id === entryId);

        setEditEntryId(entryId);

        setFormData({
            date: parseISO(entryToEdit.date),
            inStock: entryToEdit.inStock,
            stockReceived: entryToEdit.stockReceived,
            stockUsed: entryToEdit.stockUsed,
        });

        setIsEditOpen(true);
    };

    // Function to close the edit form
    const closeEditForm = () => {
        setIsEditOpen(false);
        setEditEntryId(null);
        setFormData({
            date: parseISO(new Date().toISOString().split('T')[0]),
            inStock: 0,
            stockReceived: 0,
            stockUsed: 0,
        });
    };

    const handleDelete = async (entryId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this entry?');

        if (!confirmDelete) {
            // If the user cancels the deletion, exit the function
            return;
        }

        try {
            await axios.delete(`http://localhost:4040/api/rawMaterials/${selectedMaterial}/entry/${entryId}/delete`);
            // Refresh data after deletion
            handleMaterialChange(selectedMaterial);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to handle the edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const stockBalance = calculateStockBalance();

        const editedData = {
            date: format(formData.date, 'yyyy-MM-dd'),
            inStock: formData.inStock,
            stockReceived: formData.stockReceived,
            stockUsed: formData.stockUsed,
            stockBalance: stockBalance,
        };

        try {
            await axios.put(`http://localhost:4040/api/rawMaterials/${selectedMaterial}/entry/${editEntryId}/edit`, editedData);

            // Fetching entries for the selected material from the database
            const response = await axios.get(`http://localhost:4040/api/rawMaterials/${selectedMaterial}`);
            const materialEntries = response.data.entry;

            // Find the index of the edited entry
            const editedEntryIndex = materialEntries.findIndex(entry => entry._id === editEntryId);

            // Update in-stock values and recalculate stock balances for subsequent entries
            for (let i = editedEntryIndex + 1; i < materialEntries.length; i++) {
                materialEntries[i].inStock = materialEntries[i - 1].stockBalance;
                materialEntries[i].stockBalance = calculateEditedStockBalance(materialEntries[i]);

                // Update the entry in the database
                await axios.put(`http://localhost:4040/api/rawMaterials/${selectedMaterial}/entry/${materialEntries[i]._id}/edit`, materialEntries[i]);
            }

            setMaterialData(materialEntries);

            // Clear input fields and close edit form
            closeEditForm();
        } catch (error) {
            console.error(error);
        }
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
            // Submit new entry
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

            // Close add stock form
            closeAddStock();
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className='flex relative'>
            <div className='w-72 h-screen bg-gray-500 overflow-hidden text-white'>
                <div className='overflow-y-auto h-full'>
                    <h1 className='mt-3 pl-2 text-2xl'>Raw Materials:</h1>
                    <div className='flex justify-center mt-5'>
                        <button
                            onClick={() => setSelectedMaterialType('Copper')}
                            className={`px-2 text-lg mx-2 ${selectedMaterialType === 'Copper' ? 'bg-slate-700' : ''} text-white rounded-sm`}
                        >
                            Copper
                        </button>
                        <button
                            onClick={() => setSelectedMaterialType('Brass')}
                            className={`px-2 text-xl mx-2 ${selectedMaterialType === 'Brass' ? 'bg-slate-700' : ''} text-white rounded-sm`}
                        >
                            Brass
                        </button>
                    </div>

                    {/* Step 4: Display filtered raw materials based on selected material type */}
                    <ol className='pl-2 mt-6'>
                        {filteredMaterials.map(material => (
                            <li
                                key={material._id}
                                onClick={() => handleMaterialClick(material._id)}
                                className={`cursor-pointer hover:bg-indigo-400 mt-2 ${selectedMaterial === material._id ? 'bg-slate-700' : ''}`}
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

            <div className='m-3 p-3 w-full h-3/6 overflow-auto'>
                <h1 className='mb-4 pb-2 text-5xl text-center font-bold'>Inventory Management</h1>

                <div>
                    {selectedMaterial && (
                        <div className='mt-4'>
                            {/* <h3>Data for {selectedMaterial}</h3> */}
                            <div className='table-container max-h-[calc(100vh-150px)] overflow-auto'>
                                <table className='min-w-full border border-gray-300'>
                                    <thead>
                                        <tr>
                                            <th className='border border-gray-300 p-2 text-xl'>Date</th>
                                            <th className='border border-gray-300 p-2 text-xl'>In Stock</th>
                                            <th className='border border-gray-300 p-2 text-xl'>Stock Received</th>
                                            <th className='border border-gray-300 p-2 text-xl'>Stock Used</th>
                                            <th className='border border-gray-300 p-2 text-xl'>Stock Balance</th>
                                            <th className='border border-gray-300 p-2 text-xl'>Actions</th>
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
                                                <td className='border border-gray-300 p-2 text-center text-lg'>
                                                    <button onClick={() => openEditForm(entry._id)} className='text-indigo-500 hover:underline text-xl mr-5'>
                                                        <i class="fa-regular fa-pen-to-square"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(entry._id)} className='text-red-500 hover:underline text-xl'>
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={isEditOpen ? closeEditForm : openAddStock} className={`mt-3 border p-1 rounded-md border-gray-300 ${isEditOpen ? 'hidden' : ''}`}>
                                    {isEditOpen ? 'Cancel Edit' : 'Add Stock'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isAddStockOpen && (
                        <div className='absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center'>
                            <form onSubmit={handleSubmit}
                                className='p-4 bg-white rounded-lg shadow-2xl'
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

                                    {!showAdditionalInputReceived && (
                                        <button
                                            onClick={() => setShowAdditionalInputReceived(true)}
                                            className='text-lg ml-2'
                                        >
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    )}
                                </label>

                                {showAdditionalInputReceived && (
                                    <div>
                                        <label className="block m-8 relative">
                                            <span className='absolute left-2 top-[-8px] px-1 text-sm uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                                Additional Stock Received:
                                            </span>

                                            <input
                                                type="number"
                                                value={additionalStockReceived}
                                                onChange={(e) => setAdditionalStockReceived(e.target.value)}
                                                className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                                    rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                            />
                                            <button
                                                onClick={handleStockReceivedAddButtonClick}
                                                className='ml-2 bg-gray-500 p-2 rounded-full'
                                            >
                                                Add
                                            </button>
                                        </label>

                                    </div>
                                )}



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
                                    {!showAdditionalInputUsed && (
                                        <button
                                            onClick={() => setShowAdditionalInputUsed(true)}
                                            className='text-lg ml-2'
                                        >
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    )}
                                </label>

                                {showAdditionalInputUsed && (
                                    <div>
                                        <label className="block m-8 relative">
                                            <span className='absolute left-2 top-[-8px] px-1 text-sm uppercase tracking-wide peer-focus:text-indigo-500 pointer-events-none duration-200 peer-focus:text-sm bg-white ml-2 peer-valid:text-sm'>
                                                Additional Stock Used:
                                            </span>

                                            <input
                                                type="number"
                                                value={additionalStockUsed}
                                                onChange={(e) => setAdditionalStockUsed(e.target.value)}
                                                className='px-4 py-2 text-lg outline-none border-2 border-gray-400 
                                            rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 bg-inherit'
                                            />
                                            <button
                                                onClick={handleStockUsedAddButtonClick}
                                                className='ml-2 bg-gray-500 p-2 rounded-full'
                                            >
                                                Add
                                            </button>
                                        </label>

                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className=' bg-gray-500 p-2 m-2 rounded-full'
                                >
                                    Submit Data
                                </button>
                            </form>


                        </div>
                    )}

                    {/* This is the edit form where you edit the entry. editing the entry affects the rest of the code */}
                    {isEditOpen && (
                        <div className='absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center'>
                            <form onSubmit={handleEditSubmit} className='p-4 bg-white rounded-lg shadow-2xl'>
                                <button
                                    onClick={closeEditForm}
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
                                        value={formData.inStock}
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

                                <button type="submit" className='bg-gray-500 p-2 m-2 rounded-full'>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Inventory;
