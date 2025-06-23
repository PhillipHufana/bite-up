import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

const rootElement = document.getElementById("root")

if (!rootElement) {
  console.error("Root element not found. Make sure there's a div with id='root' in your HTML.")
  throw new Error("Failed to find the root element")
}

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
