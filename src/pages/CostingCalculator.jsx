"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "../components/Navbar"

const CostingCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Chocolate Chip Cookies",
      image: "../assets/1.png",
      productionDate: "17/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 70,
      totalIngredientWeight: 100.0,
      ingredientWeightPerPortion: 1.43,
      suggestedSellingPrice: "₱1.00",
      totalSales: "₱42.00",
      totalCostIngredients: "₱14.00",
      overheadExpense: "₱16.00",
      netProfit: "₱11.20",
      costPerPortion: "₱0.20",
      foodCostPercentage: "33%",
      profitPerPortion: "₱0.16",
      profitMargin: "27%",
      ingredients: [
        { name: "All-purpose Flour", brand: "Maya", unit: "Cup", quantity: 7, grams: 12, cost: 120 },
        { name: "Baking Soda", brand: "Arm & Hammer", unit: "Cup", quantity: 1, grams: 20, cost: 56 },
        { name: "Brown Sugar", brand: "Hermano", unit: "Cup", quantity: 2, grams: 10, cost: 24 },
        { name: "Buttercup, Salted", brand: "Magnolia", unit: "Cup", quantity: 1, grams: 30, cost: 64 },
        { name: "Egg, (50-55 grams)", brand: "Bounty Fresh", unit: "Cup", quantity: 2, grams: 100, cost: 16 },
        { name: "Salt, Iodized", brand: "Fidel", unit: "Teaspoon", quantity: 1, grams: 10, cost: 12 },
        { name: "White Sugar (Granulated)", brand: "SRA", unit: "Cup", quantity: 1, grams: 10, cost: 24 },
      ],
    },
    {
      id: 2,
      name: "Ensaymada",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "18/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 50,
      totalIngredientWeight: 85.0,
      ingredientWeightPerPortion: 1.7,
      suggestedSellingPrice: "₱2.50",
      totalSales: "₱125.00",
      totalCostIngredients: "₱45.00",
      overheadExpense: "₱25.00",
      netProfit: "₱55.00",
      costPerPortion: "₱0.90",
      foodCostPercentage: "36%",
      profitPerPortion: "₱1.10",
      profitMargin: "44%",
      ingredients: [
        { name: "Bread Flour", brand: "Maya", unit: "Cup", quantity: 5, grams: 15, cost: 150 },
        { name: "Butter", brand: "Magnolia", unit: "Cup", quantity: 2, grams: 50, cost: 80 },
        { name: "Eggs", brand: "Bounty Fresh", unit: "Piece", quantity: 3, grams: 150, cost: 45 },
        { name: "Sugar", brand: "SRA", unit: "Cup", quantity: 1, grams: 20, cost: 30 },
        { name: "Milk", brand: "Alaska", unit: "Cup", quantity: 1, grams: 240, cost: 25 },
      ],
    },
    {
      id: 3,
      name: "Cream Cheese Bun",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "19/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 40,
      totalIngredientWeight: 120.0,
      ingredientWeightPerPortion: 3.0,
      suggestedSellingPrice: "₱3.00",
      totalSales: "₱120.00",
      totalCostIngredients: "₱50.00",
      overheadExpense: "₱20.00",
      netProfit: "₱50.00",
      costPerPortion: "₱1.25",
      foodCostPercentage: "42%",
      profitPerPortion: "₱1.25",
      profitMargin: "42%",
      ingredients: [
        { name: "Bread Flour", brand: "Maya", unit: "Cup", quantity: 4, grams: 20, cost: 120 },
        { name: "Cream Cheese", brand: "Philadelphia", unit: "Cup", quantity: 2, grams: 100, cost: 200 },
        { name: "Sugar", brand: "SRA", unit: "Cup", quantity: 1, grams: 15, cost: 25 },
      ],
    },
    {
      id: 4,
      name: "Cinnamon Roll",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "20/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 30,
      totalIngredientWeight: 90.0,
      ingredientWeightPerPortion: 3.0,
      suggestedSellingPrice: "₱4.00",
      totalSales: "₱120.00",
      totalCostIngredients: "₱40.00",
      overheadExpense: "₱30.00",
      netProfit: "₱50.00",
      costPerPortion: "₱1.33",
      foodCostPercentage: "33%",
      profitPerPortion: "₱1.67",
      profitMargin: "42%",
      ingredients: [
        { name: "Flour", brand: "Maya", unit: "Cup", quantity: 3, grams: 18, cost: 90 },
        { name: "Cinnamon", brand: "McCormick", unit: "Teaspoon", quantity: 2, grams: 5, cost: 15 },
        { name: "Brown Sugar", brand: "Hermano", unit: "Cup", quantity: 1, grams: 12, cost: 20 },
      ],
    },
    {
      id: 5,
      name: "Lengua de Gato",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "21/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 80,
      totalIngredientWeight: 60.0,
      ingredientWeightPerPortion: 0.75,
      suggestedSellingPrice: "₱0.75",
      totalSales: "₱60.00",
      totalCostIngredients: "₱20.00",
      overheadExpense: "₱15.00",
      netProfit: "₱25.00",
      costPerPortion: "₱0.25",
      foodCostPercentage: "33%",
      profitPerPortion: "₱0.31",
      profitMargin: "42%",
      ingredients: [
        { name: "Flour", brand: "Maya", unit: "Cup", quantity: 2, grams: 10, cost: 60 },
        { name: "Butter", brand: "Magnolia", unit: "Cup", quantity: 1, grams: 25, cost: 40 },
      ],
    },
    {
      id: 6,
      name: "Banana Bread",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "22/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 20,
      totalIngredientWeight: 200.0,
      ingredientWeightPerPortion: 10.0,
      suggestedSellingPrice: "₱5.00",
      totalSales: "₱100.00",
      totalCostIngredients: "₱35.00",
      overheadExpense: "₱25.00",
      netProfit: "₱40.00",
      costPerPortion: "₱1.75",
      foodCostPercentage: "35%",
      profitPerPortion: "₱2.00",
      profitMargin: "40%",
      ingredients: [
        { name: "Flour", brand: "Maya", unit: "Cup", quantity: 3, grams: 20, cost: 90 },
        { name: "Bananas", brand: "Fresh", unit: "Piece", quantity: 4, grams: 400, cost: 60 },
        { name: "Sugar", brand: "SRA", unit: "Cup", quantity: 1, grams: 15, cost: 25 },
      ],
    },
    {
      id: 7,
      name: "Dark Chocolate Brownies",
      image: "/placeholder.svg?height=80&width=80",
      productionDate: "23/06/2025",
      desiredQuantity: "100%",
      desiredPortions: 25,
      totalIngredientWeight: 150.0,
      ingredientWeightPerPortion: 6.0,
      suggestedSellingPrice: "₱6.00",
      totalSales: "₱150.00",
      totalCostIngredients: "₱60.00",
      overheadExpense: "₱30.00",
      netProfit: "₱60.00",
      costPerPortion: "₱2.40",
      foodCostPercentage: "40%",
      profitPerPortion: "₱2.40",
      profitMargin: "40%",
      ingredients: [
        { name: "Dark Chocolate", brand: "Ricoa", unit: "Cup", quantity: 2, grams: 100, cost: 200 },
        { name: "Flour", brand: "Maya", unit: "Cup", quantity: 2, grams: 15, cost: 60 },
        { name: "Cocoa Powder", brand: "Ricoa", unit: "Cup", quantity: 1, grams: 30, cost: 80 },
      ],
    },
  ]

  const currentProduct = products[selectedProduct]

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar activeTab="COSTING" />
      <div className="flex h-[calc(100vh-80px)] bg-amber-50">
        {/* Sidebar */}
        <div
          className={`${sidebarCollapsed ? "w-16" : "w-80"} transition-all duration-300 bg-white shadow-lg border-r border-amber-200 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-amber-200 flex items-center justify-between">
            {!sidebarCollapsed && <h2 className="text-lg font-semibold text-amber-900">Products</h2>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "space-x-3"}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className={`${sidebarCollapsed ? "w-8 h-8" : "w-16 h-16"} object-cover rounded-lg border border-amber-200`}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-amber-900 text-sm leading-tight">{product.name}</h3>
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
              <h1 className="text-2xl lg:text-4xl font-[Marcellus] text-amber-900 mb-5">{currentProduct.name}</h1>
              <h2 className="text-xl lg:text-2xl font-[Poppins] font-bold text-gray-800 mb-10">Total Food Costing</h2>
            </div>

            {/* Cost Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Left Column - Production Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Production Date:</span>
                  <span className="font-semibold text-gray-900">{currentProduct.productionDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Desired Quantity (% of Full Recipe)</span>
                  <span className="font-semibold text-gray-900">{currentProduct.desiredQuantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Desired # of Portions</span>
                  <span className="font-semibold text-gray-900">{currentProduct.desiredPortions}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Total Ingredient Weight (Grams)</span>
                  <span className="font-semibold text-gray-900">{currentProduct.totalIngredientWeight}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Ingredient Weight per Portion (Grams)</span>
                  <span className="font-semibold text-gray-900">{currentProduct.ingredientWeightPerPortion}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Suggested Selling Price Per Portion</span>
                  <span className="font-semibold text-gray-900">{currentProduct.suggestedSellingPrice}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">
                    Total Sales (If all {currentProduct.desiredPortions} portions sold)
                  </span>
                  <span className="font-semibold text-gray-900">{currentProduct.totalSales}</span>
                </div>
              </div>

              {/* Right Column - Cost Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">(Less) Total Cost of Ingredients</span>
                  <span className="font-semibold text-gray-900">{currentProduct.totalCostIngredients}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">(Less) Overhead/Op Expense (40%)</span>
                  <span className="font-semibold text-gray-900">{currentProduct.overheadExpense}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Net Profit of All Portions Sold</span>
                  <span className="font-semibold text-gray-900">{currentProduct.netProfit}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Cost of Ingredients per Portion</span>
                  <span className="font-semibold text-gray-900">{currentProduct.costPerPortion}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Food Cost %</span>
                  <span className="font-semibold text-green-600">{currentProduct.foodCostPercentage}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Profit per Portion</span>
                  <span className="font-semibold text-gray-900">{currentProduct.profitPerPortion}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Profit Margin</span>
                  <span className="font-semibold text-green-600">{currentProduct.profitMargin}</span>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-amber-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ingredients</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Brand</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit of Measure</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grams</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProduct.ingredients.map((ingredient, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-sm text-gray-900">{ingredient.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{ingredient.brand}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{ingredient.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{ingredient.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{ingredient.grams}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{ingredient.cost}</td>
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
  )
}

export default CostingCalculator
