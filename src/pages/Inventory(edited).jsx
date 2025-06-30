"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import CreatableSelect from "react-select/creatable"
import Select from "react-select"
import { ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react"
import Navbar from "../components/Navbar"

const Inventory = () => {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formItems, setFormItems] = useState([
    {
      category: "",
      itemName: "",
      brand: "",
      unit: "",
      unitPrice: "",
      quantity: "",
      amount: ""
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
    } catch (err) {
      console.error("Error fetching data:", err)
      setLoading(false)
    }
  }

  const updateFormItem = (index, field, value) => {
    const updatedItems = [...formItems]
    updatedItems[index][field] = value
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
        amount: ""
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
          unit: item.unit,
          amount: parseFloat(item.amount),
          price: parseFloat(item.unitPrice),
          quantity: parseInt(item.quantity),
          purchase_date: new Date().toISOString().split("T")[0],
        })),
      });

      setShowModal(false);
      setFormItems([
        {
          category: "",
          itemName: "",
          brand: "",
          unit: "",
          unitPrice: "",
          quantity: "",
          amount: ""
        },
      ]);

      fetchIngredients();
    } catch (err) {
      console.error("Error saving multiple items:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar activeTab="INVENTORY" />

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between mb-8">
          <h2 className="text-4xl font-bold text-amber-800">Inventory</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
          >
            ADD NEW
          </button>
        </div>

        {loading ? <p>Loading...</p> : <p>Inventory data loaded.</p>}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {formItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Category:</label>
                    <CreatableSelect
                      isClearable
                      onChange={(selected) => updateFormItem(index, "category", selected ? selected.value : "")}
                      onCreateOption={(inputValue) => updateFormItem(index, "category", inputValue)}
                      value={item.category ? { label: item.category, value: item.category } : null}
                      options={Array.from(new Set(ingredients.map(i => i.category))).map(c => ({ label: c, value: c }))}
                      classNamePrefix="react-select"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Item Name:</label>
                    <CreatableSelect
                      isClearable
                      onChange={(selected) => updateFormItem(index, "itemName", selected ? selected.value : "")}
                      onCreateOption={(inputValue) => updateFormItem(index, "itemName", inputValue)}
                      value={item.itemName ? { label: item.itemName, value: item.itemName } : null}
                      options={Array.from(new Set(ingredients.map(i => i.name))).map(n => ({ label: n, value: n }))}
                      classNamePrefix="react-select"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Brand:</label>
                    <CreatableSelect
                      isClearable
                      onChange={(selected) => updateFormItem(index, "brand", selected ? selected.value : "")}
                      onCreateOption={(inputValue) => updateFormItem(index, "brand", inputValue)}
                      value={item.brand ? { label: item.brand, value: item.brand } : null}
                      options={Array.from(new Set(ingredients.map(i => i.brand))).map(b => ({ label: b, value: b }))}
                      classNamePrefix="react-select"
                    />
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
                    <label className="block text-sm font-medium text-amber-800 mb-2">Amount per Unit:</label>
                    <input
                      type="number"
                      value={item.amount || ""}
                      onChange={(e) => updateFormItem(index, "amount", e.target.value)}
                      className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
                      placeholder="e.g. 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Unit:</label>
                    <Select
                      options={["grams", "kg", "ml", "l", "piece"].map(u => ({ label: u, value: u }))}
                      value={item.unit ? { label: item.unit, value: item.unit } : null}
                      onChange={(selected) => updateFormItem(index, "unit", selected ? selected.value : "")}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button onClick={addNewFormItem} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
                  ADD ITEM
                </button>
                <button onClick={handleModalSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory