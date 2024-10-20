import React, { useState, useEffect, useRef } from 'react'
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
    const [data, setData] = useState([]);
    // const today = new Date();
    // const startDateString = today.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    const componentRef = useRef();
    const navigate = useNavigate();
    const [totalStockBalance, setTotalStockBalance] = useState(0);

    useEffect(() => {
        axios.get('http://apps.copalcor.co.za:4040/api/rawmaterials')
            .then(res => setData(res.data))
            .catch(er => console.error(er));
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const filteredData = data.filter((stock) => {
                const entriesWithinRange = stock.entry.filter(entry => {
                    const entryDate = new Date(entry.date).toLocaleDateString();
                    return (!startDate || entryDate === new Date(startDate).toLocaleDateString());
                });

                return entriesWithinRange.length > 0;
            });

            const stockBalanceTotal = filteredData.reduce((total, stock) => {
                const latestEntry = stock.entry[stock.entry.length - 1];
                return total + (latestEntry ? latestEntry.stockBalance : 0);
            }, 0);

            setTotalStockBalance(stockBalanceTotal);
        }
    }, [data, startDate]);

    return (
        <div>
            <h1 className='text-center text-4xl mb-4 mt-2 font-bold'>Summary Report</h1>

            <ReactToPrint
                trigger={() => <button className='ml-6 p-2 text-4xl'><i class="fa-solid fa-print"></i></button>}
                content={() => componentRef.current}

            />
            <div className='ml-6 p-1'>
                <label>Select Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='pl-2'
                />
            </div>
            {/* <div className='ml-6 p-1'>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='pl-2'
                />
            </div> */}

            <div className='p-3 m-4' ref={componentRef}>
                <h1 className='text-center text-2xl mb-4 font-bold'>Stock on Hand</h1>
                <table className='min-w-full border border-gray-300 border-collapse '>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 p-2 text-xl'>Date</th>
                            <th className='border border-gray-300 p-2 text-xl'>Item Number</th>
                            <th className='border border-gray-300 p-2 text-xl'>Item Name</th>
                            <th className='border border-gray-300 p-2 text-xl'>Material Type</th>
                            <th className='border border-gray-300 p-2 text-xl'>Stock Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const entriesWithinRange = item.entry.filter(entry => {
                                const entryDate = new Date(entry.date).toLocaleDateString();
                                return (!startDate || entryDate === new Date(startDate).toLocaleDateString());
                            });

                            const latestEntry = entriesWithinRange[entriesWithinRange.length - 1];

                            return (
                                <tr key={`${index}-${item.itemNumber}`}>
                                    <td className='border border-gray-300 p-2 text-center text-md'>
                                        {latestEntry ? new Date(latestEntry.date).toLocaleDateString() : ' '}
                                    </td>
                                    <td className='border border-gray-300 p-2 text-center text-md'>{item.itemNumber}</td>
                                    <td className='border border-gray-300 p-2 text-center text-md'>{item.itemName}</td>
                                    <td className='border border-gray-300 p-2 text-center text-md'>{item.materialType}</td>
                                    <td className='border border-gray-300 p-2 text-center text-md'>
                                        {latestEntry ? latestEntry.stockBalance : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <td colSpan="4" className='border border-gray-300 p-2 text-right font-bold text-lg'>Total:</td>
                        <td className='border border-gray-300 p-2 text-center text-md font-bold'>
                            {totalStockBalance}
                        </td>
                    </tfoot>
                </table>
            </div>
            <button
                onClick={() => navigate('/')}
                className='ml-7 mb-3 border p-1 rounded-md border-gray-300'
            >Home</button>

        </div>
    );
}

export default Summary