import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Calculator, Package } from "lucide-react"
import Navbar from "../components/navbar"

const CostingCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [products, setProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)
  const [desiredPortions, setDesiredPortions] = useState(70)

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/catalog")
        setProducts(res.data)
        setCurrentProduct(res.data[0])
      } catch (err) {
        console.error("Error fetching products:", err)
      }
    }
    fetchProducts()
  }, [])

  // Fetch product details when selection changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const selected = products[selectedProduct]
        if (!selected) {
          console.error("Product not found in list")
          return
        }

        const res = await axios.get(`/api/catalog/${selected.id}`)
        const ingredients = res.data

        setCurrentProduct({
          ...selected,
          ingredients: Array.isArray(ingredients) ? ingredients : [],
        })
      } catch (err) {
        console.error("Error fetching product details:", err)
        setCurrentProduct({
          ...products[selectedProduct],
          ingredients: [],
        })
      }
    }

    fetchProductDetails()
  }, [selectedProduct, products])

  const handlePortionsChange = (e) => {
    const value = Number.parseInt(e.target.value) || 0
    setDesiredPortions(value)
  }

  if (!currentProduct || !currentProduct.ingredients)
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar activeTab="COSTING" />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-80"
          } transition-all duration-300 bg-white shadow-xl border-r border-amber-200 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-amber-200 flex items-center justify-between bg-gradient-to-r from-amber-100 to-orange-100">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-amber-900 ml-2">Products</h2>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-amber-200 text-amber-700 transition-all duration-200 hover:scale-105"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(index)}
                className={`${
                  selectedProduct === index
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 shadow-lg scale-[1.02]"
                    : "bg-white border-gray-200 hover:bg-amber-50 hover:shadow-md"
                } ${
                  sidebarCollapsed ? "p-2" : "p-4"
                } border rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
              >
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "space-x-3"}`}>
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt={product.name}
                    className={`${
                      sidebarCollapsed ? "w-8 h-8" : "w-16 h-16"
                    } object-cover rounded-lg border-2 border-amber-200 shadow-sm`}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-amber-900 text-sm leading-tight truncate">{product.name}</h3>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-amber-600 mr-3" />
                <h1 className="text-3xl lg:text-4xl font-[Marcellus] text-amber-900">{currentProduct.name}</h1>
              </div>
              <h2 className="text-xl lg:text-2xl font-[Poppins] font-bold text-gray-800 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Food Costing Calculator
              </h2>
            </div>

            {/* Desired Portions Input */}
            <div className="mb-8 flex justify-center">
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 max-w-md w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Desired Number of Portions
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={desiredPortions}
                    onChange={handlePortionsChange}
                    min="1"
                    className="w-full px-4 py-3 text-center text-2xl font-bold text-amber-900 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter portions"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-amber-600 font-medium">portions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Left Column */}
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></div>
                  Production Details
                </h3>
                <div className="space-y-4">
                  {[
                    ["Production Date", currentProduct.productionDate],
                    ["Desired Quantity (% of Full Recipe)", currentProduct.desiredQuantity],
                    ["Total Ingredient Weight (Grams)", currentProduct.totalIngredientWeight],
                    ["Ingredient Weight per Portion (Grams)", currentProduct.ingredientWeightPerPortion],
                    ["Suggested Selling Price Per Portion", currentProduct.suggestedSellingPrice],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-3 px-4 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <span className="font-medium text-gray-700 text-sm">{label}</span>
                      <span className="font-bold text-amber-900 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                  Cost Analysis
                </h3>
                <div className="space-y-4">
                  {[
                    ["Total Cost of Ingredients", `₱${(currentProduct.totalCostIngredients || 0).toFixed(2)}`],
                    ["Overhead/Op Expense (40%)", currentProduct.overheadExpense],
                    ["Cost of Ingredients per Portion", currentProduct.costPerPortion],
                    ["Food Cost %", currentProduct.foodCostPercentage, true],
                  ].map(([label, value, highlight]) => (
                    <div
                      key={label}
                      className={`flex justify-between items-center py-3 px-4 rounded-lg border ${
                        highlight ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-100"
                      }`}
                    >
                      <span className="font-medium text-gray-700 text-sm">{label}</span>
                      <span className={`font-bold text-sm ${highlight ? "text-green-700" : "text-amber-900"}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Ingredients Breakdown
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50 border-b border-amber-200">
                    <tr>
                      {["Ingredients", "Brand", "Unit of Measure", "Quantity", "Cost", "Price Increase"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-sm font-semibold text-amber-900 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {currentProduct.ingredients.map((ingredient, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-amber-25"
                        } hover:bg-amber-50 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{ingredient.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{ingredient.brand}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{ingredient.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{ingredient.quantity}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-900">{ingredient.cost}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-900">{ingredient.cost}</td>
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