"use client";

import { useState } from "react";
import InventoryRecords from "../components/InventoryRecords.jsx";
import CustomerProfile from "../components/CustomerProfile.jsx";
import SalesRecord from "../components/SalesRecord.jsx";
import Navbar from "../components/navbar";

function RecordsPage() {
  const [activeTab, setActiveTab] = useState("inventory");

  const tabs = [
    { id: "inventory", label: "Procurement Record" },
    { id: "customer", label: "Customer Profile" },
    { id: "sales", label: "Sales Record" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryRecords />;
      case "customer":
        return <CustomerProfile />;
      case "sales":
        return <SalesRecord />;
      default:
        return <InventoryRecords />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar activeTab="RECORDS" />

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        <h1 className="text-8xl sm:text-4xl font-[Marcellus] text-amber-800 mb-8">
          Records
        </h1>

        <div className="flex space-x-4 border-b-2 border-amber-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2 text-sm sm:text-base font-medium transition-all duration-200 rounded-t-md ${
                activeTab === tab.id
                  ? "text-amber-900 font-semibold"
                  : "text-gray-500"
              }`}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#C4B38F";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#666666";
                }
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-600 rounded-t-md transition-all duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-[#fff6e3] border-2 border-[#d08700] rounded-2xl shadow-md p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default RecordsPage;
