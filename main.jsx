import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // อ้างอิงถึงไฟล์ App.jsx ของเรา
import './index.css'; // อ้างอิงถึงไฟล์ Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);