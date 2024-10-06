// src/App.js
import React from 'react';
import ProjectList from './components/ProjectList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <div className="container">
            <h1>Task Manager</h1>
  
            {/* ProjectList component to display and manage the list of projects */}
            <ProjectList />
        </div>
    );
};

export default App;
