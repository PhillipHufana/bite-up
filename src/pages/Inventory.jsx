"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react"
import Navbar from "../components/Navbar"

const Inventory = () => {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [editRowId, setEditRowId] = useState(null)
  const [editData, setEditData] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [highlightedRowId, setHighlightedRowId] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const categories = ["Additives, Improvers, Leaveners", "Alcohol", "Butter, Margarine, Shortening", "Cereals, Grinds, Flakes", "Cheese (Cream Cheese)",
    "Cheese (General)", "Chocolates", "Cocoa Powder", "Cooking Oils", "Egg & Egg Powder", "Flavorings and Food Color", "Flour and Starches", "Fondant and Gumpaste", 
    "Fruits, Fillings", "Milk (Condensed/Condensada)", "Milk (Creams, Yogurt)", "Milk (Evaporated)", "Milk (Fresh)", "Milk (Powder)", "Nuts", "Other", "Salt, Seasonings & Spices", 
    "Spreads", "Sweeteners", "Syrups", "Added Ingredients"]
  const brands = ["Brand A", "Brand B", "Brand C"]

  //Form state for modal
  const [formItems, setFormItems] = useState([
    {
      category: "",
      itemName: "",
      brand: "",
      unit: "",
      unitPrice: "",
      quantity: "",
      ml: "",
      grams: "",
      costPerUnit: "",
    },
  ])

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/ingredients")
      setIngredients(res.data)
      setLoading(false)

      const grouped = groupByCategory(res.data)
      const initialExpanded = {}
      Object.keys(grouped).forEach((cat) => {
        initialExpanded[cat] = false
      })
      setExpandedCategories(initialExpanded)
    } catch (err) {
      console.error("Error fetching data:", err)
      setLoading(false)
    }
  }

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  }

const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleEditClick = (item) => {
    setEditRowId(item.ingredient_id)
    setEditData(item)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/ingredients/${id}`, editData)
      setEditRowId(null)
      fetchIngredients()
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

    const handleDelete = async (id) => {
  if (!id || typeof id !== "string") {
    console.warn("Invalid ingredient_id:", id);
    return;
  }

  if (window.confirm("Are you sure you want to delete this item?")) {
    try {
      setDeletingId(id); // Start loading
      await axios.delete(`http://localhost:3001/api/ingredients/${id}`);
      await fetchIngredients(); // Refresh UI
    } catch (err) {
      console.error("Delete failed:", err.response?.data?.error || err.message);
      alert(`Error: ${err.response?.data?.error || "Check console for details"}`);
    } finally {
      setDeletingId(null);
    }
  }
};

  //Modal Form Handlers
  const updateFormItem = (index, field, value) => {
    const updatedItems = [...formItems]
    updatedItems[index][field] = value
    setFormItems(updatedItems)
  }

  const removeFormItem = (index) => {
    const updatedItems = [...formItems]
    updatedItems.splice(index, 1)
    setFormItems(updatedItems)
  }

  const addNewFormItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        category: "",
        itemName: "",
        brand: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        ml: "",
        grams: "",
        costPerUnit: "",
      },
    ])
  }

  const handleModalSave = async () => {
  try {
    if (!formItems || formItems.length === 0) return;

    const response = await axios.post("http://localhost:3001/api/ingredients/bulk", {
      items: formItems.map((item) => ({
        category: item.category,
        name: item.itemName,
        brand: item.brand,
        unit: item.unit || "unit",
        price: parseFloat(item.unitPrice),
        quantity: parseInt(item.quantity),
        ml_to_gram_conversion:
          item.ml && item.grams
            ? (parseFloat(item.grams) / parseFloat(item.ml)).toFixed(5)
            : 0,
        cost_per_gram: parseFloat(item.costPerUnit) || 0,
        purchase_date: new Date().toISOString().split("T")[0],
      })),
    });

    const updatedIds = response.data.updatedIds || [];

    if (updatedIds.length > 0) {
      setHighlightedRowId(updatedIds); // pass full array
    }



    setShowModal(false);
    setFormItems([
      {
        category: "",
        itemName: "",
        brand: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        ml: "",
        grams: "",
        costPerUnit: "",
      },
    ]);

    fetchIngredients();
  } catch (err) {
    console.error("Error saving multiple items:", err);
  }
};

  const groupedData = groupByCategory(ingredients)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Use the new Navbar component */}
      <Navbar activeTab="INVENTORY" />

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-[Marcellus] text-8xl sm:text-4xl font-bold text-amber-800">General Inventory</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center cursor-pointer space-x-2"
          >
            <span>ADD NEW</span>
            <span className="text-lg">+</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-amber-700 ml-4 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedData).map(([category, items]) => (
              <div key={category} className="bg-amber-100 rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="cursor-pointer w-full px-6 py-4 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 flex justify-between items-center transition-all duration-200"
                >
                  <span className="text-lg font-semibold text-amber-900">{category}</span>
                  {expandedCategories[category] ? (
                    <ChevronUp className="w-6 h-6 text-amber-700" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-amber-700" />
                  )}
                </button>

                {expandedCategories[category] && (
                  <div className="p-6">
                    {items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-amber-200 text-amber-900">
                              <th className="px-4 py-3 text-left font-semibold">Item</th>
                              <th className="px-4 py-3 text-left font-semibold">Brand</th>
                              <th className="px-4 py-3 text-left font-semibold">Unit</th>
                              <th className="px-4 py-3 text-left font-semibold">Price</th>
                              <th className="px-4 py-3 text-left font-semibold">Qty</th>
                              <th className="px-4 py-3 text-left font-semibold">ML→G</th>
                              <th className="px-4 py-3 text-left font-semibold">Cost/g</th>
                              <th className="px-4 py-3 text-left font-semibold">Purchase Date</th>
                              <th className="px-4 py-3 text-left font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => {
                              const isEditing = editRowId === item.ingredient_id;
                            return (
                              <tr
                                key={item.ingredient_id}
                                className={
                                Array.isArray(highlightedRowId) && highlightedRowId.includes(item.ingredient_id)
                                ? "bg-yellow-200 transition-colors duration-300"
                          : ""
                                }
    >


                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="name"
                                        value={editData.name}
                                        onChange={handleChange}
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.name
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="brand"
                                        value={editData.brand}
                                        onChange={handleChange}
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.brand
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="unit"
                                        value={editData.unit}
                                        onChange={handleChange}
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.unit
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="price"
                                        value={editData.price}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      `₱${item.price}`
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="quantity"
                                        value={editData.quantity}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.quantity
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="ml_to_gram_conversion"
                                        value={editData.ml_to_gram_conversion}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.00001"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.ml_to_gram_conversion
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="cost_per_gram"
                                        value={editData.cost_per_gram}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.00001"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.cost_per_gram
                                    )}
                                  </td>
                                  <td className="px-4 py-3">{item.purchase_date}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                      {isEditing ? (
                                        <button
                                          onClick={() => handleSave(item.ingredient_id)}
                                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleEditClick(item)}
                                            className="text-amber-600 hover:text-amber-800 transition-colors"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(item.ingredient_id)}
                                              className="text-red-600 hover:text-red-800 transition-colors">
                                              {deletingId === item.ingredient_id ? (
                                              <span className="text-xs text-gray-500 animate-pulse">Deleting...</span>
                                            ) : (
                                              <Trash2 className="w-4 h-4" />
                                            )}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
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
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-amber-900">ADD NEW ITEM</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-amber-700 hover:text-amber-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="space-y-6">
                {formItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-amber-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-amber-800">Item {index + 1}</h4>
                      {formItems.length > 1 && (
                        <button
                          onClick={() => removeFormItem(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Item Name:</label>
                        <input
                          type="string"
                          value={item.itemName}
                          onChange={(e) => updateFormItem(index, "itemName", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Item Name"
                        />
                      </div>

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

            <div className="bg-amber-100 px-6 py-4 flex justify-end space-x-4">
              <button
                  type="button"
                  onClick={handleModalSave}
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
