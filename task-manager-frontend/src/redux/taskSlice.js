import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async thunk to fetch tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await api.get('/tasks/');
    return response.data; // Return the response data
});

// Async thunk to add a new task
export const addTask = createAsyncThunk('tasks/addTask', async (newTask) => {
    const response = await api.post('/tasks/', newTask);
    return response.data; // Return the added task data
});

// Async thunk to update a task
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, name, is_completed, project }) => {
    const response = await api.put(`/tasks/${id}/`, { name, is_completed, project });
    return response.data; 
});


// Async thunk to delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await api.delete(`/tasks/${taskId}/`);
    return taskId; // Return the deleted task ID
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [], // Will hold the task data
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null, // For storing error messages
    },
    reducers: {
        // You can add additional synchronous actions here if needed
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading'; // Update status to loading when the fetch starts
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Update status to succeeded when the fetch completes
                state.items = action.payload; // Update items with the fetched tasks data
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed'; // Update status to failed if there was an error
                state.error = action.error.message; // Store the error message
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.items.push(action.payload); // Add the new task to the task list
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload; // Get the updated task from the response
                const index = state.items.findIndex(task => task.id === updatedTask.id); // Find the task to update
                if (index !== -1) {
                    state.items[index] = updatedTask; // Update the task in the state
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.error.message; // Store error message if update fails
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(task => task.id !== action.payload); // Remove the task from the state
            });
    }
});

// Export the reducer to be used in the store
export default taskSlice.reducer;
