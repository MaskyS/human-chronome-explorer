// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { DataProvider } from './context/DataContext'
import App from './App'
import './index.css' 

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
)