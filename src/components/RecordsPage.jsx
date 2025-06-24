"use client"

import { useState } from "react"
import InventoryRecords from "./InventoryRecords.jsx"
import CustomerProfile from "./CustomerProfile.jsx"
import SalesRecord from "./SalesRecord.jsx"

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("inventory")

  const tabs = [
    { id: "inventory", label: "Inventory Records" },
    { id: "customer", label: "Customer Profile" },
    { id: "sales", label: "Sales Record" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryRecords />
      case "customer":
        return <CustomerProfile />
      case "sales":
        return <SalesRecord />
      default:
        return <InventoryRecords />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-marcellus" style={{ color: "#444444" }}>
        Records
      </h1>

      {/* Custom Tab Navigation with smooth transitions */}
      <div className="border-b-2 border-gray-300">
        <div className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-poppins font-medium transition-all duration-300 ease-in-out relative ${
                activeTab === tab.id ? "text-yellow-700" : "text-gray-500"
              }`}
              style={{
                color: activeTab === tab.id ? "#E6CA3E" : "#666666",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#3F331F"
                  e.currentTarget.style.backgroundColor = "rgba(230, 202, 62, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#666666"
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ease-in-out rounded-t-lg"
                  style={{ backgroundColor: "#E6CA3E" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content with increased border radius */}
      <div className="border-2 rounded-2xl p-6" style={{ borderColor: "#3F331F" }}>
        {renderContent()}
      </div>
    </div>
  )
}
