"use client";

import { useState } from "react";
import InventoryRecords from "../components/InventoryRecords.jsx";
import CustomerProfile from "../components/CustomerProfile.jsx";
import SalesRecord from "../components/SalesRecord.jsx";

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("inventory");

  const tabs = [
    { id: "inventory", label: "Inventory Records" },
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
    <div className="space-y-6">
      <h1 className="text-4xl font-marcellus" style={{ color: "#444444" }}>
        Records
      </h1>

      <div>
        <div className="flex space-x-0 border-b-2 border-gray-300 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-poppins font-medium transition-all duration-300 ease-in-out relative ${
                activeTab === tab.id ? "text-yellow-700" : "text-gray-500"
              }`}
              style={{
                color: activeTab === tab.id ? "#000000" : "#666666",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#C4B38F";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#444444";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ease-in-out rounded-t-lg"
                  style={{ backgroundColor: "#C4B38F" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-6" />
      <div
        className="border-2 rounded-2xl p-8"
        style={{ borderColor: "#3F331F" }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
