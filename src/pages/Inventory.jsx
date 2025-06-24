"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react"

const Inventory = () => {
  const [expandedCategories, setExpandedCategories] = useState({
    Alcohol: true,
  })
  const [showModal, setShowModal] = useState(false)
  const [formItems, setFormItems] = useState([
    {
      category: "",
      itemName: "",
      brand: "",
      unitPrice: "",
      quantity: "",
      ml: "",
      grams: "",
      costPerUnit: "",
    },
  ])

  // Sample data
  const inventoryData = {
    "Additives, Improvers, Leaveners": [],
    Alcohol: [
      {
        itemName: "Absolut Vodka",
        brand: "Absolut",
        unitPrice: "985.00",
        quantity: "1,000",
        ml: "00 ml",
        grams: "00 grams",
        costPerUnit: "0.00000",
      },
      {
        itemName: "Cherry Brandy",
        brand: "Cherry",
        unitPrice: "985.00",
        quantity: "1,000",
        ml: "00 ml",
        grams: "00 grams",
        costPerUnit: "0.00000",
      },
    ],
    "Butter, Margarine, Shortening": [],
  }

  const categories = ["Additives, Improvers, Leaveners", "Alcohol", "Butter, Margarine, Shortening"]
  const itemNames = ["Absolut Vodka", "Cherry Brandy", "Butter", "Margarine"]
  const brands = ["Absolut", "Cherry", "Brand A", "Brand B", "Brand C"]

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const addNewFormItem = () => {
    setFormItems([
      ...formItems,
      {
        category: "",
        itemName: "",
        brand: "",
        unitPrice: "",
        quantity: "",
        ml: "",
        grams: "",
        costPerUnit: "",
      },
    ])
  }

  const updateFormItem = (index, field, value) => {
    const updatedItems = formItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormItems(updatedItems)
  }

  const removeFormItem = (index) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter((_, i) => i !== index))
    }
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving items:", formItems)
    setShowModal(false)
    setFormItems([
      {
        category: "",
        itemName: "",
        brand: "",
        unitPrice: "",
        quantity: "",
        ml: "",
        grams: "",
        costPerUnit: "",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-bold tracking-wide">BiteUP</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="hover:text-amber-200 transition-colors">
                  ORDER
                </a>
                <a href="#" className="hover:text-amber-200 transition-colors">
                  COSTING
                </a>
                <a href="#" className="text-amber-200 font-semibold">
                  INVENTORY
                </a>
                <a href="#" className="hover:text-amber-200 transition-colors">
                  RECORDS
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-amber-800">General Inventory</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            ADD NEW +
          </button>
        </div>

        {/* Inventory Categories */}
        <div className="space-y-4">
          {Object.entries(inventoryData).map(([category, items]) => (
            <div key={category} className="bg-amber-100 rounded-lg shadow-md overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 flex justify-between items-center transition-all duration-200"
              >
                <span className="text-lg font-semibold text-amber-900">{category}</span>
                {expandedCategories[category] ? (
                  <ChevronUp className="w-6 h-6 text-amber-700" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-amber-700" />
                )}
              </button>

              {/* Category Content */}
              {expandedCategories[category] && (
                <div className="p-6">
                  {items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-amber-200 text-amber-900">
                            <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                            <th className="px-4 py-3 text-left font-semibold">Brand</th>
                            <th className="px-4 py-3 text-left font-semibold">Unit Price</th>
                            <th className="px-4 py-3 text-left font-semibold">Quantity</th>
                            <th className="px-4 py-3 text-left font-semibold">ML</th>
                            <th className="px-4 py-3 text-left font-semibold">Grams</th>
                            <th className="px-4 py-3 text-left font-semibold">Cost per ml/gram</th>
                            <th className="px-4 py-3 text-left font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-b border-amber-200 hover:bg-amber-50">
                              <td className="px-4 py-3">{item.itemName}</td>
                              <td className="px-4 py-3">
                                <select className="bg-amber-100 border border-amber-300 rounded px-2 py-1 text-sm">
                                  <option>{item.brand}</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">{item.unitPrice}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                              <td className="px-4 py-3">{item.ml}</td>
                              <td className="px-4 py-3">{item.grams}</td>
                              <td className="px-4 py-3">{item.costPerUnit}</td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <button className="text-amber-600 hover:text-amber-800">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-amber-700 text-center py-8">No items in this category</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-amber-900">ADD NEW ITEM</h3>
              <button onClick={() => setShowModal(false)} className="text-amber-700 hover:text-amber-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="space-y-6">
                {formItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-amber-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-amber-800">Item {index + 1}</h4>
                      {formItems.length > 1 && (
                        <button onClick={() => removeFormItem(index)} className="text-red-600 hover:text-red-800">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Category:</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateFormItem(index, "category", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item Name */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Item Name:</label>
                        <select
                          value={item.itemName}
                          onChange={(e) => updateFormItem(index, "itemName", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Item</option>
                          {itemNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Brand */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Brand:</label>
                        <select
                          value={item.brand}
                          onChange={(e) => updateFormItem(index, "brand", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Unit Price:</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateFormItem(index, "unitPrice", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Quantity:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateFormItem(index, "quantity", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="0"
                        />
                      </div>

                      {/* ML */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">ML:</label>
                        <input
                          type="number"
                          value={item.ml}
                          onChange={(e) => updateFormItem(index, "ml", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="0"
                        />
                      </div>

                      {/* Grams */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Grams:</label>
                        <input
                          type="number"
                          value={item.grams}
                          onChange={(e) => updateFormItem(index, "grams", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="0"
                        />
                      </div>

                      {/* Cost per Unit */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Cost per ml/gram:</label>
                        <input
                          type="number"
                          value={item.costPerUnit}
                          onChange={(e) => updateFormItem(index, "costPerUnit", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="0.00000"
                          step="0.00001"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-amber-100 px-6 py-4 flex justify-end space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                SAVE
              </button>
              <button
                onClick={addNewFormItem}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                ADD NEW +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory
