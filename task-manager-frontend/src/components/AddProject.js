import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProject } from '../redux/projectSlice';

const AddProject = () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name) {
            dispatch(addProject({ name }));
            setName(''); // Clear the input field
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="New Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Add Project</button>
            </div>
        </form>
    );
};

export default AddProject;
