import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Get the root element from the document
const rootElement = document.getElementById('root')

// Check if the root element exists
if (!rootElement) {
  console.error('Root element not found in the document')
} else {
  // Create a React root and render the App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}