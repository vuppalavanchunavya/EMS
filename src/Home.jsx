import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/employee');
                // Assuming that higher IDs are newer
                const sortedData = response.data.sort((a, b) => b.id - a.id);
                setData(sortedData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = (id) => {
        const confirm = window.confirm("Would you like to delete?");
        if (confirm) {
            axios.delete('http://localhost:3000/employee/' + id)
                .then(() => {
                    setData(data.filter(item => item.id !== id));
                })
                .catch(err => console.log(err));
        }
    };

    // Filter data based on search query
    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery)
    );

    // Calculate the current data to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Page change handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='d-flex flex-column justify-content-center align-items-center bg-light vh-100'>
            <h1>List of Employees</h1>
            <div className='w-100 rounded bg-white border shadow p-4'>
                <div className='d-flex justify-content-end mb-3'>
                    <Link to="/create" className='btn btn-success'>Add +</Link>
                </div>
                <div className='mb-3'>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='Search by name, email or phone'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>S.No</th> {/* Serial Number Column */}
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((d, index) => (
                            <tr key={d.id}>
                                <td>{indexOfFirstItem + index + 1}</td> {/* Serial Number */}
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                                <td>{d.email}</td>
                                <td>{d.phone}</td>
                                <td>
                                    <Link to={`/read/${d.id}`} className='btn btn-sm btn-info me-2'>Read</Link>
                                    <Link to={`/update/${d.id}`} className='btn btn-sm btn-primary me-2'>Edit</Link>
                                    <button onClick={() => handleDelete(d.id)} className='btn btn-sm btn-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <nav>
                    <ul className='pagination'>
                        <li className='page-item'>
                            <button
                                className='page-link'
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className='page-item'>
                                <button
                                    className='page-link'
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className='page-item'>
                            <button
                                className='page-link'
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Home;

