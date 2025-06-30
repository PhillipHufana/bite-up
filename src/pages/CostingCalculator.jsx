import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "../components/Navbar"

const CostingCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [products, setProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products")
        const data = await res.json()
        setProducts(data)
        setCurrentProduct(data[0])
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
        if (!selected) {
          console.error("Product not found in list");
          return;
        }
        
        const res = await fetch(`http://localhost:3001/api/products/${selected.id}`);
        if (!res.ok) throw new Error("Failed to fetch product details");
        
        const ingredients = await res.json();
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

  if (!currentProduct || !currentProduct.ingredients) return <div>Loading...</div>

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
                    src="/placeholder.svg?height=80&width=80"
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
                  <span className="font-medium text-gray-700">Production Date: </span>
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
                  <span className="font-semibold text-gray-900">₱{(currentProduct.totalCostIngredients || 0).toFixed(2)}</span>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price Increase</th>
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