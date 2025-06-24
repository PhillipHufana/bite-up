import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import CostingCalculator from './pages/CostingCalculator';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Records from './pages/Records';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {path:"/", element: <App />},
  {path:"/costingcalculator", element: <CostingCalculator />},
  {path:"/inventory", element: <Inventory />},
  {path:"/orders", element: <Orders />},
  {path:"/records", element: <Records />},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
