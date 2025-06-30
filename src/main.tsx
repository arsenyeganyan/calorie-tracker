import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store.js';

//ensured that doc is not null!!!!
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)