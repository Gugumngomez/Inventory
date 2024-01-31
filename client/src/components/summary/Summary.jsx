import React, { useState, useEffect, useRef } from 'react'
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const componentRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:4040/api/rawmaterials')
            .then(res => setData(res.data))
            .catch(er => console.error(er));
    }, []);

    return (
        <div>
            <h1 className='text-center text-4xl mb-4 mt-2 font-bold'>Summary Report</h1>

            <ReactToPrint
                trigger={() => <button className='ml-6 p-2 text-4xl'><i class="fa-solid fa-print"></i></button>}
                content={() => componentRef.current}

            />
            <div className='ml-6 p-1'>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='pl-2'
                />
            </div>
            <div className='ml-6 p-1'>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='pl-2'
                />
            </div>

            <div className='p-3 m-4' ref={componentRef}>
                <h1 className='text-center text-2xl mb-4 font-bold'>Stock on Hand</h1>
                <table className='min-w-full border border-gray-300 border-collapse '>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 p-2 text-xl'>Date</th>
                            <th className='border border-gray-300 p-2 text-xl'>Item Number</th>
                            <th className='border border-gray-300 p-2 text-xl'>Item Name</th>
                            <th className='border border-gray-300 p-2 text-xl'>Stock Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            item.entry.map((entry, subIndex) => {
                                const entryDate = entry.date && entry.date.split('T')[0]; // Extract date part from ISO string
                                const start = startDate;
                                const end = endDate;

                                return (!start || entryDate >= start) &&
                                    (!end || entryDate <= end) ? (
                                    <tr key={`${index}-${subIndex}`}>
                                        <td className='border border-gray-300 p-2 text-center text-md'>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className='border border-gray-300 p-2 text-center text-md'>{item.itemNumber}</td>
                                        <td className='border border-gray-300 p-2 text-center text-md'>{item.itemName}</td>
                                        <td className='border border-gray-300 p-2 text-center text-md'>{entry.stockBalance}</td>
                                    </tr>
                                ) : null;
                            })
                        ))}
                    </tbody>
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