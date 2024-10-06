import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectSlice";
import taskReducer from './taskSlice'; // Import taskSlice

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: taskReducer, // Add the task reducer to the store
  },
});

export default store;
