import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Determine the API base URL based on the environment
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Async thunk to fetch projects from the API
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const response = await api.get(`${API_URL}/api/projects/`);
    return response.data; // Return the response data
});

// Async thunk to fetch tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await api.get(`${API_URL}/api/tasks/`);
    return response.data; // Return the response data
});

// Async thunk to add a new project
export const addProject = createAsyncThunk('projects/addProject', async (newProject) => {
    const response = await api.post(`${API_URL}/api/projects/`, newProject);
    return response.data; // Return the newly created project
});

// Async thunk to delete a project
export const deleteProject = createAsyncThunk('projects/deleteProject', async (projectId) => {
    await api.delete(`${API_URL}/api/projects/${projectId}/`);
    return projectId; // Return the ID of the deleted project
});

// Async thunk to update a project
export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, name }) => {
    const response = await api.put(`${API_URL}/api/projects/${id}/`, { name });
    return response.data; // Return the updated project data
});

// Create a slice for projects
const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        items: [], // Will hold the project data
        tasks: [], // Will hold the task data
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null, // For storing error messages
    },
    reducers: {
        // You can add additional synchronous actions here if needed
    },
    extraReducers(builder) {
        builder
            // Fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading'; // Update status to loading when the fetch starts
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Update status to succeeded when the fetch completes
                state.items = action.payload; // Update items with the fetched data
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed'; // Update status to failed if there was an error
                state.error = action.error.message; // Store the error message
            })

            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading'; // Update status to loading when the fetch starts
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Update status to succeeded when the fetch completes
                state.tasks = action.payload; // Update tasks with the fetched data
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed'; // Update status to failed if there was an error
                state.error = action.error.message; // Store the error message
            })

            // Add a new project
            .addCase(addProject.fulfilled, (state, action) => {
                state.items.push(action.payload); // Add the new project to the list
            })

            // Delete a project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.items = state.items.filter(project => project.id !== action.payload); // Remove the deleted project
            })

            // Update a project
            .addCase(updateProject.fulfilled, (state, action) => {
                const updatedProject = action.payload;
                const index = state.items.findIndex(project => project.id === updatedProject.id);
                if (index !== -1) {
                    state.items[index] = updatedProject; // Update the project in the state
                }
            });
    }
});

// Export the reducer to be used in the store
export default projectSlice.reducer;
