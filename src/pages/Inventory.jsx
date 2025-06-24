"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react"

const Inventory = () => {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [editRowId, setEditRowId] = useState(null)
  const [editData, setEditData] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [showModal, setShowModal] = useState(false)

  // Dropdown placeholder values
  const categories = ["Meat", "Vegetables", "Condiments", "Dairy"]
  const itemNames = ["Chicken", "Tomato", "Salt", "Milk"]
  const brands = ["Brand A", "Brand B", "Brand C"]

  // Form state for modal
  const [formItems, setFormItems] = useState([
    {
      category: "",
      itemName: "",
      brand: "",
      unitPrice: "",
      quantity: "",
      ml: "",
      grams: "",
      costPerUnit: ""
    }
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
        initialExpanded[cat] = true
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
    const confirmDelete = window.confirm("Are you sure you want to delete this item?")
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:3001/api/ingredients/${id}`)
      setIngredients((prev) => prev.filter((item) => item.ingredient_id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  // Modal Form Handlers
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
        unitPrice: "",
        quantity: "",
        ml: "",
        grams: "",
        costPerUnit: ""
      }
    ])
  }

  const handleModalSave = async () => {
    try {
      await Promise.all(
        formItems.map(item =>
          axios.post("http://localhost:3001/api/ingredients", {
            category: item.category,
            name: item.itemName,
            brand: item.brand,
            price: parseFloat(item.unitPrice),
            quantity: parseInt(item.quantity),
            ml_to_gram_conversion:
              item.ml && item.grams ? (parseFloat(item.grams) / parseFloat(item.ml)).toFixed(5) : 0,
            cost_per_gram: parseFloat(item.costPerUnit),
            purchase_date: new Date().toISOString().split("T")[0]
          })
        )
      )
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
          costPerUnit: ""
        }
      ])
      fetchIngredients()
    } catch (err) {
      console.error("Error saving new items:", err)
    }
  }

  const groupedData = groupByCategory(ingredients)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold tracking-wide">BiteUP Inventory</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-amber-800">General Inventory</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
          >
            ADD NEW +
          </button>
        </div>

        {loading ? (
          <p className="text-amber-700">Loading...</p>
        ) : (
          Object.entries(groupedData).map(([category, items]) => (
            <div key={category} className="bg-amber-100 rounded-lg shadow-md overflow-hidden mb-6">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-200 to-orange-200 flex justify-between items-center"
              >
                <span className="text-lg font-semibold text-amber-900">{category}</span>
                {expandedCategories[category] ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedCategories[category] && (
                <div className="p-6">
                  {items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-amber-200">
                          <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Brand</th>
                            <th className="px-4 py-2">Unit</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Qty</th>
                            <th className="px-4 py-2">ML→G</th>
                            <th className="px-4 py-2">Cost/g</th>
                            <th className="px-4 py-2">Purchase Date</th>
                            <th className="px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => {
                            const isEditing = editRowId === item.ingredient_id
                            return (
                              <tr key={item.ingredient_id} className="border-b hover:bg-amber-50">
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input name="name" value={editData.name} onChange={handleChange} />
                                  ) : (
                                    item.name
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input name="brand" value={editData.brand} onChange={handleChange} />
                                  ) : (
                                    item.brand
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input name="unit" value={editData.unit} onChange={handleChange} />
                                  ) : (
                                    item.unit
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input name="price" value={editData.price} onChange={handleChange} />
                                  ) : (
                                    `₱${item.price}`
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input name="quantity" value={editData.quantity} onChange={handleChange} />
                                  ) : (
                                    item.quantity
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input
                                      name="ml_to_gram_conversion"
                                      value={editData.ml_to_gram_conversion}
                                      onChange={handleChange}
                                    />
                                  ) : (
                                    item.ml_to_gram_conversion
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <input
                                      name="cost_per_gram"
                                      value={editData.cost_per_gram}
                                      onChange={handleChange}
                                    />
                                  ) : (
                                    item.cost_per_gram
                                  )}
                                </td>
                                <td className="px-4 py-2">{item.purchase_date}</td>
                                <td className="px-4 py-2">
                                  {isEditing ? (
                                    <button
                                      onClick={() => handleSave(item.ingredient_id)}
                                      className="text-green-600 hover:underline"
                                    >
                                      Save
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditClick(item)}
                                        className="text-amber-600 hover:underline mr-2"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item.ingredient_id)}
                                        className="text-red-600 hover:underline"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-amber-600">No items available.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-amber-900">ADD NEW ITEM</h3>
              <button onClick={() => setShowModal(false)} className="text-amber-700 hover:text-amber-900">
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
                        <button onClick={() => removeFormItem(index)} className="text-red-600 hover:text-red-800">
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
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
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
                        <select
                          value={item.itemName}
                          onChange={(e) => updateFormItem(index, "itemName", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                        >
                          <option value="">Select Item</option>
                          {itemNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Brand:</label>
                        <select
                          value={item.brand}
                          onChange={(e) => updateFormItem(index, "brand", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
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
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Quantity:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateFormItem(index, "quantity", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">ML:</label>
                        <input
                          type="number"
                          value={item.ml}
                          onChange={(e) => updateFormItem(index, "ml", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Grams:</label>
                        <input
                          type="number"
                          value={item.grams}
                          onChange={(e) => updateFormItem(index, "grams", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Cost per ml/gram:</label>
                        <input
                          type="number"
                          value={item.costPerUnit}
                          onChange={(e) => updateFormItem(index, "costPerUnit", e.target.value)}
                          className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
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
                onClick={handleModalSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                SAVE
              </button>
              <button
                onClick={addNewFormItem}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
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
