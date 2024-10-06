import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root using createRoot
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
