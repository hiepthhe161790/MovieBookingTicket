import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'remixicon/fonts/remixicon.css';
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; 
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);
