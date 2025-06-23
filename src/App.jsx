"use client";

import { useState } from "react";
import Navigation from "./components/Navigation.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import CostingPage from "./pages/CostingPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import RecordsPage from "./pages/RecordsPage.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("ORDER");

  const renderContent = () => {
    switch (activeTab) {
      case "ORDER":
        return <OrdersPage />;
      case "COSTING":
        return <CostingPage />;
      case "INVENTORY":
        return <InventoryPage />;
      case "RECORDS":
        return <RecordsPage />;
      default:
        return <OrdersPage />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEF2E5" }}>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {renderContent()}
      </main>
    </div>
  );
}
