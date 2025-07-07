"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion.jsx";

function InventoryRecords() {
  const [records, setRecords] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [orderBy, setOrderBy] = useState("Newest First");
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  const sortOptions = ["Name", "Date", "Cost"];
  const orderOptions = ["Newest First", "Oldest First"];

  const fetchInventoryRecords = async () => {
    try {
      const response = await fetch("/api/inventory/records");
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch inventory records:", error);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchInventoryRecords();
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRecords = Array.isArray(records)
    ? records
        .filter((record) => {
          if (!filterDate) return true;
          const localDate = new Date(record.date).toISOString().slice(0, 10);
          return localDate === filterDate;
        })
        .sort((a, b) => {
          let valA, valB;
          switch (sortBy) {
            case "Name":
              valA = a.id.toLowerCase();
              valB = b.id.toLowerCase();
              break;
            case "Date":
              valA = new Date(a.date);
              valB = new Date(b.date);
              break;
            case "Cost":
              valA = parseFloat(a.totalCost.replace("P ", "")) || 0;
              valB = parseFloat(b.totalCost.replace("P ", "")) || 0;
              break;
            default:
              return 0;
          }
          const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
          return orderBy === "Newest First" ? -comparison : comparison;
        })
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-marcellus mb-4 mt-3 text-[#702d05]">
        Procurement Record
      </h2>

      <div className="rounded-xl p-4">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          ref={dropdownRef}
        >
          {/* Filter by Date */}
          <div>
            <label className="block mb-1 font-semibold text-amber-900">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 transition-all duration-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <label className="block mb-1 font-semibold text-amber-900">
              Sort By
            </label>
            <button
              onClick={() => toggleDropdown("sort")}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center"
            >
              {sortBy}
              {openDropdown === "sort" ? (
                <ChevronUpIcon className="w-5 h-5 text-amber-700" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-amber-700" />
              )}
            </button>
            {openDropdown === "sort" && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 rounded-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Dropdown */}
          <div className="relative">
            <label className="block mb-1 font-semibold text-amber-900">
              Order
            </label>
            <button
              onClick={() => toggleDropdown("order")}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center"
            >
              {orderBy}
              {openDropdown === "order" ? (
                <ChevronUpIcon className="w-5 h-5 text-amber-700" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-amber-700" />
              )}
            </button>
            {openDropdown === "order" && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10">
                {orderOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setOrderBy(option);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 rounded-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Records Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {filteredRecords.map((record) => (
            <AccordionItem
              key={record.id}
              value={record.id}
              className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-poppins font-semibold text-amber-900">
                      {record.id}
                    </div>
                    <div className="text-sm font-poppins text-[#222]">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-green-600 font-poppins font-bold text-lg">
                      {record.totalCost}
                    </div>
                    <div
                      className="text-sm font-poppins"
                      style={{ color: "#222" }}
                    >
                      {record.itemCount} items
                    </div>
                    <div className="font-poppins font-semibold text-amber-900">
                      {record.supplier}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div
                  className="rounded-xl overflow-hidden border-none"
                  style={{ backgroundColor: "rgb(237 228 192)" }}
                >
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#fef3c6" }}>
                      <tr>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Ingredients
                        </th>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Brand
                        </th>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Price per Unit
                        </th>
                        <th className="px-4 py-3 text-left font-poppins font-semibold text-[#7b3306]">
                          Total Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.items.map((item, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: "#ffffff" }}
                          className="hover:bg-opacity-25 transition-colors duration-200"
                        >
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.ingredient}
                          </td>
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.brand}
                          </td>
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.unit}
                          </td>
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.unitPrice}
                          </td>
                          <td
                            className="px-4 py-3 font-poppins"
                            style={{ color: "#222222" }}
                          >
                            {item.totalCost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default InventoryRecords;
