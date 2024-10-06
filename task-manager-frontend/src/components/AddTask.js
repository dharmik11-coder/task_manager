import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice';

const AddTask = ({ projectId }) => {
    const [taskName, setTaskName] = useState('');
    const dispatch = useDispatch();

    const handleAddTask = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            dispatch(addTask({ name: taskName, is_completed: false, project: projectId }));
            setTaskName(''); // Clear the input field after adding
        }
    };

    return (
        <form onSubmit={handleAddTask}>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                className="form-control"
            />
            <button type="submit" className="btn btn-primary mt-2">
                Add Task
            </button>
        </form>
    );
};

export default AddTask;
