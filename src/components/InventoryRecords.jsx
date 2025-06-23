"use client";

import { useState } from "react";
import Input from "./ui/Input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion.jsx";

const mockInventoryRecords = [
  {
    id: "RCP-2025-001",
    date: "June 17, 2025 15:24",
    totalCost: "P 1,233.25",
    itemCount: 3,
    supplier: "BP Baking Supplies and Cooking Equipment",
    items: [
      {
        ingredient: "Unsalted Butter",
        brand: "Anchor",
        quantity: 4,
        unit: "225g",
        totalCost: "P 667.00",
      },
      {
        ingredient: "Vegetable Oil",
        brand: "Pacific Sunrise",
        quantity: 1,
        unit: "1L",
        totalCost: "P 156.00",
      },
      {
        ingredient: "Margarine",
        brand: "Bravo Butter Cream",
        quantity: 10,
        unit: "225g",
        totalCost: "P 410.00",
      },
    ],
  },
  {
    id: "RCP-2025-002",
    date: "June 07, 2025 15:24",
    totalCost: "P 7,062.25",
    itemCount: 64,
    supplier: "BP Baking Supplies and Cooking Equipment",
    items: [
      {
        ingredient: "All Purpose Flour",
        brand: "Gold Medal",
        quantity: 20,
        unit: "1kg",
        totalCost: "P 2,400.00",
      },
      {
        ingredient: "Sugar",
        brand: "Domino",
        quantity: 15,
        unit: "1kg",
        totalCost: "P 1,800.00",
      },
      {
        ingredient: "Baking Powder",
        brand: "Calumet",
        quantity: 5,
        unit: "454g",
        totalCost: "P 750.00",
      },
    ],
  },
  {
    id: "RCP-2025-003",
    date: "May 17, 2025 15:24",
    totalCost: "P 7,062.25",
    itemCount: 9,
    supplier: "BP Baking Supplies and Cooking Equipment",
    items: [
      {
        ingredient: "Vanilla Extract",
        brand: "McCormick",
        quantity: 3,
        unit: "59ml",
        totalCost: "P 450.00",
      },
      {
        ingredient: "Cocoa Powder",
        brand: "Hershey's",
        quantity: 2,
        unit: "226g",
        totalCost: "P 320.00",
      },
      {
        ingredient: "Salt",
        brand: "Morton",
        quantity: 4,
        unit: "737g",
        totalCost: "P 200.00",
      },
    ],
  },
];

export default function InventoryRecords() {
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("newest");

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h2
        className="text-3xl font-marcellus mb-12 mt-3"
        style={{ color: "#444444" }}
      >
        Inventory Records
      </h2>
      {/* Filters */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "rgba(68,68,68,0.15)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-sm font-poppins mb-2 font-semibold"
              style={{ color: "#222222" }}
            >
              Filter by Date
            </label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg"
            />
          </div>
          <div>
            <label
              className="block text-sm font-poppins mb-2 font-semibold"
              style={{ color: "#222222" }}
            >
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              className="block text-sm font-poppins mb-2 font-semibold"
              style={{ color: "#222222" }}
            >
              Order
            </label>
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Inventory Records */}
      <Accordion type="single" collapsible className="space-y-4">
        {mockInventoryRecords.map((record) => (
          <AccordionItem
            key={record.id}
            value={record.id}
            className="bg-[rgba(68,68,68,0.09)] rounded-xl"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <div>
                    <div
                      className="font-poppins font-semibold"
                      style={{ color: "#222222" }}
                    >
                      {record.id}
                    </div>
                    <div className="text-sm font-poppins text-gray-600">
                      {record.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-green-600 font-poppins font-bold text-lg">
                    {record.totalCost}
                  </div>
                  <div
                    className="text-sm font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {record.itemCount} items
                  </div>
                  <div
                    className="font-poppins font-semibold"
                    style={{ color: "#222222" }}
                  >
                    {record.supplier}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
              >
                <table className="w-full">
                  <thead style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Ingredients
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Total Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items.map((item, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                        className="border-b border-gray-300 hover:bg-opacity-25 transition-colors duration-200"
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
  );
}
