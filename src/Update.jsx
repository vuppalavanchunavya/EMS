import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Update() {
    const { id } = useParams();
    const [values, setValues] = useState({
        id: '',
        name: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({
        id: '',
        name: '',
        email: '',
        phone: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the employee data to populate the form
        axios.get('http://localhost:3000/employee/' + id)
            .then(res => {
                setValues(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const checkIdUniqueness = async (newId) => {
        try {
            // Fetch all employees
            const response = await axios.get('http://localhost:3000/employee');
            // Check if the new ID is already taken (excluding current ID being updated)
            const isDuplicate = response.data.some(employee => employee.id === newId && employee.id !== id);
            return isDuplicate;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const validate = async () => {
        const newErrors = {};
        let isValid = true;

        if (!values.id) {
            newErrors.id = 'Id is required';
            isValid = false;
        } else if (await checkIdUniqueness(values.id)) {
            newErrors.id = 'Id must be unique';
            isValid = false;
        }

        if (!values.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!values.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!values.phone) {
            newErrors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(values.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (await validate()) {
            axios.put('http://localhost:3000/employee/' + id, values)
                .then(res => {
                    console.log(res);
                    navigate('/');
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light'>
            <div className='w-100 border bg-white shadow px-5 pt-3 pb-5 rounded'>
                <h1>Update Employee</h1>
                <form onSubmit={handleUpdate}>
                    <div className='mb-2'>
                        <label htmlFor="id">Id:</label>
                        <input
                            type="number"
                            name='id'
                            className='form-control'
                            placeholder='Enter id'
                            value={values.id}
                            onChange={e => setValues({ ...values, id: e.target.value })}
                        />
                        {errors.id && <div className='text-danger'>{errors.id}</div>}
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name='name'
                            className='form-control'
                            placeholder='Enter name'
                            value={values.name}
                            onChange={e => setValues({ ...values, name: e.target.value })}
                        />
                        {errors.name && <div className='text-danger'>{errors.name}</div>}
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name='email'
                            className='form-control'
                            placeholder='Enter email'
                            value={values.email}
                            onChange={e => setValues({ ...values, email: e.target.value })}
                        />
                        {errors.email && <div className='text-danger'>{errors.email}</div>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            name='phone'
                            className='form-control'
                            placeholder='Enter phone'
                            value={values.phone}
                            onChange={e => setValues({ ...values, phone: e.target.value })}
                        />
                        {errors.phone && <div className='text-danger'>{errors.phone}</div>}
                    </div>
                    <button className='btn btn-success'>Submit</button>
                    <Link to="/" className='btn btn-primary ms-3'>Back</Link>
                </form>
            </div>
        </div>
    );
}

export default Update;
