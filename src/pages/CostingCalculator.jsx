"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/navbar";

const CostingCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/catalog");
        setProducts(res.data);
        setCurrentProduct(res.data[0]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch product details when selection changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const selected = products[selectedProduct];
        if (!selected) {
          console.error("Product not found in list");
          return;
        }

        const res = await axios.get(`/api/catalog/${selected.id}`);
        const ingredients = res.data;

        setCurrentProduct({
          ...selected,
          ingredients: Array.isArray(ingredients) ? ingredients : [],
        });
      } catch (err) {
        console.error("Error fetching product details:", err);
        setCurrentProduct({
          ...products[selectedProduct],
          ingredients: [],
        });
      }
    };

    fetchProductDetails();
  }, [selectedProduct, products]);

  if (!currentProduct || !currentProduct.ingredients)
    return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar activeTab="COSTING" />
      <div className="flex h-[calc(100vh-80px)] bg-amber-50">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-80"
          } transition-all duration-300 bg-white shadow-lg border-r border-amber-200 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-amber-200 flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-amber-900">Products</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(index)}
                className={`${
                  selectedProduct === index
                    ? "bg-amber-100 border-amber-300 shadow-md"
                    : "bg-white border-gray-200 hover:bg-amber-50"
                } ${
                  sidebarCollapsed ? "p-2" : "p-4"
                } border rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:shadow-md`}
              >
                <div
                  className={`flex items-center ${
                    sidebarCollapsed ? "justify-center" : "space-x-3"
                  }`}
                >
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt={product.name}
                    className={`${
                      sidebarCollapsed ? "w-8 h-8" : "w-16 h-16"
                    } object-cover rounded-lg border border-amber-200`}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-amber-900 text-sm leading-tight">
                        {product.name}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-4xl font-[Marcellus] text-amber-900 mb-5">
                {currentProduct.name}
              </h1>
              <h2 className="text-xl lg:text-2xl font-[Poppins] font-bold text-gray-800 mb-10">
                Total Food Costing
              </h2>
            </div>
            {/* Cost Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                {[
                  ["Production Date", currentProduct.productionDate],
                  ["Desired Quantity (% of Full Recipe)", currentProduct.desiredQuantity],
                  ["Desired # of Portions", currentProduct.desiredPortions],
                  ["Total Ingredient Weight (Grams)", currentProduct.totalIngredientWeight],
                  ["Ingredient Weight per Portion (Grams)", currentProduct.ingredientWeightPerPortion],
                  ["Suggested Selling Price Per Portion", currentProduct.suggestedSellingPrice],
                  [
                    `Total Sales (If all ${currentProduct.desiredPortions} portions sold)`,
                    currentProduct.totalSales,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
              {/* Right Column */}
              <div className="space-y-4">
                {[
                  ["(Less) Total Cost of Ingredients", `₱${(currentProduct.totalCostIngredients || 0).toFixed(2)}`],
                  ["(Less) Overhead/Op Expense (40%)", currentProduct.overheadExpense],
                  ["Net Profit of All Portions Sold", currentProduct.netProfit],
                  ["Cost of Ingredients per Portion", currentProduct.costPerPortion],
                  ["Food Cost %", currentProduct.foodCostPercentage, true],
                  ["Profit per Portion", currentProduct.profitPerPortion],
                  ["Profit Margin", currentProduct.profitMargin, true],
                ].map(([label, value, highlight]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{label}</span>
                    <span
                      className={`font-semibold ${
                        highlight ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Ingredients Table */}
            <div className="bg-amber-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-100 border-b border-gray-200">
                    <tr>
                      {[
                        "Ingredients",
                        "Brand",
                        "Unit of Measure",
                        "Quantity",
                        "Grams",
                        "Cost",
                        "Price Increase",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProduct.ingredients.map((ingredient, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {ingredient.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {ingredient.brand}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {ingredient.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {ingredient.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {ingredient.grams}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {ingredient.cost}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {ingredient.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostingCalculator;
