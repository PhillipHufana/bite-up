import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Calculator, Package, TrendingUp, BarChart3 } from "lucide-react"
import Navbar from "../components/navbar"

const CostingCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [products, setProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)
  const [desiredPortions, setDesiredPortions] = useState(1)
  const [ingredients, setIngredients] = useState([])


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
        const selected = products[selectedProduct];
        if (!selected) return;

        const res = await axios.get(`/api/catalog/${selected.id}`);
        setCurrentProduct(selected); // Only product info
        setIngredients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setIngredients([]);
      }
    };
    fetchProductDetails();
  }, [selectedProduct, products]);

  const handlePortionsChange = (e) => {
    const value = Number.parseInt(e.target.value) || 1
    setDesiredPortions(value)
  }

  // Core calculations
  const weightPerPortion = ingredients.reduce((sum, ing) => sum + ing.quantity, 0); //Sum of all ingredient weights needed for just one portion
  const totalWeight = weightPerPortion * desiredPortions;
  const ingredientWeightPerPortion = weightPerPortion;

  const totalCostIngredients = ingredients.reduce((sum, ing) => sum + ing.quantity * ing.cost * desiredPortions, 0) || 0;
  const costPerPortion = totalCostIngredients / desiredPortions;
  
  const suggestedSellingPrice = Math.ceil(costPerPortion * 3);
  const totalSales = suggestedSellingPrice * desiredPortions;
  const foodCostPercentage = Math.round((costPerPortion / suggestedSellingPrice) * 100);
  const overheadExpense = totalSales * 0.4;


  // Metric Card Component
  const MetricCard = ({ label, value, color = "amber", prefix = "", suffix = "" }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-2xl font-bold text-${color}-700`}>
          {prefix}
          {typeof value === "number" ? value.toFixed(2) : value}
          {suffix}
        </span>
      </div>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
    </div>
  )

  if (!currentProduct || !currentProduct.ingredients === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar activeTab="COSTING" />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-80"
          } transition-all duration-300 bg-white shadow-xl border-r border-amber-200 flex flex-col h-full ${
            sidebarCollapsed ? "" : "fixed lg:relative z-30"
          } ${sidebarCollapsed ? "relative" : "lg:translate-x-0"}`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-amber-200 flex items-center justify-between bg-gradient-to-r from-amber-100 to-orange-100">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-amber-900">Products</h2>
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

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-10">
              <div className="flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mr-3" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[Marcellus] text-amber-900">
                  {currentProduct.name}
                </h1>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-[Poppins] font-bold text-gray-800 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
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
                    className="w-full px-4 py-3 text-center text-xl sm:text-2xl font-bold text-amber-900 bg-amber-50 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter portions"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-amber-600 font-medium text-sm">portions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Details and Cost Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
              {/* Production Details */}
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-amber-900">Production Details</h3>
                  <BarChart3 className="w-5 h-5 text-amber-600 ml-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetricCard label="Total Ingredient Weight (Grams)" value={totalWeight} color="blue" suffix="g" />
                  <MetricCard label="Ingredient Weight per Portion" value={ingredientWeightPerPortion} color="blue" suffix="g" />
                  <MetricCard
                    label="Suggested Price per Portion"
                    value={suggestedSellingPrice}
                    color="green"
                    prefix="₱"
                  />
                  <MetricCard label="Total Sales" value={totalSales} color="green" prefix="₱" />
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-amber-900">Cost Analysis</h3>
                  <TrendingUp className="w-5 h-5 text-green-600 ml-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetricCard label="Total Ingredient Cost" value={totalCostIngredients} color="red" prefix="₱" />
                  <MetricCard label="Cost of Ingredient per Portion" value={costPerPortion} color="red" prefix="₱" />
                  <MetricCard label="Overhead Expense (40%)" value={overheadExpense} color="orange" prefix="₱" />
                  <MetricCard label="Food Cost Percentage" value={foodCostPercentage} color="purple" suffix="%" />
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-900 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Ingredients Breakdown
                  </h3>
                  <span className="text-sm text-amber-700 font-medium">
                    {ingredients.length} ingredients
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Ingredient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Total Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ingredients.map((ing, index) => (
                      <tr key={index} className="hover:bg-amber-50 transition-colors duration-150">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{ing.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{ing.brand}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {(ing.quantity * desiredPortions).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {ing.unit}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-green-600">
                            ₱{(ing.quantity * ing.cost * desiredPortions).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-right font-semibold text-gray-900">
                        Total Cost:
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-lg text-green-600">
                        ₱{totalCostIngredients.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
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

