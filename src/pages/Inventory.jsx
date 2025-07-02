"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { ChevronDown, ChevronUp, Edit, Trash2, X, Plus } from "lucide-react";
import Navbar from "../components/navbar";

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState([]);
  const [boldRowId, setBoldRowId] = useState([]);



  //Form state for modal
  const [formItems, setFormItems] = useState([
    {
      category: "",
      itemName: "",
      brand: "",
      unitPrice: "",
      quantity: "",
      unit: "",
      purchaseDate: "",
    },
  ]);

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#fef7ed", // amber-50
      borderColor: state.isFocused ? "#d97706" : "#fbbf24", // amber-600 : amber-400
      borderWidth: "2px",
      borderRadius: "0.75rem", // rounded-xl
      minHeight: "44px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(217, 119, 6, 0.1)" : "none",
      "&:hover": {
        borderColor: "#d97706", // amber-600
      },
      transition: "all 0.2s ease",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px",
    }),
    input: (provided) => ({
      ...provided,
      color: "#92400e", // amber-800
      fontSize: "14px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a3a3a3", // neutral-400
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#92400e", // amber-800
      fontSize: "14px",
      fontWeight: "500",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fffbeb", // amber-50
      border: "2px solid #fbbf24", // amber-400
      borderRadius: "0.75rem",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      zIndex: 9999,
      maxHeight: "200px",
      overflowY: "auto",
      overflowX: "hidden",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "8px",
      maxHeight: "184px",
      overflowY: "auto",
      overflowX: "hidden",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#fef7ed",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#fbbf24",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#d97706",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#d97706" // amber-600
        : state.isFocused
        ? "#fde68a" // amber-200
        : "transparent",
      color: state.isSelected ? "#ffffff" : "#92400e", // white : amber-800
      padding: "12px 16px",
      borderRadius: "0.5rem",
      margin: "2px 0",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: state.isSelected ? "600" : "500",
      transition: "all 0.15s ease",
      "&:hover": {
        backgroundColor: state.isSelected ? "#d97706" : "#fde68a",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#d97706", // amber-600
      padding: "0 8px",
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "transform 0.2s ease",
      "&:hover": {
        color: "#92400e", // amber-800
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#ef4444", // red-500
      padding: "0 8px",
      "&:hover": {
        color: "#dc2626", // red-600
      },
    }),
  };

  useEffect(() => {
  fetchIngredients();
}, []);


  const fetchIngredients = async () => {
  try {
    const res = await axios.get("/api/ingredients");
    const sorted = sortIngredients(res.data);
    setIngredients(sorted);
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setLoading(false);
  }
};
//sorting the ingredients alphabetically and based on date in ascending order
const sortIngredients = (items) =>
  [...items].sort((a, b) => {
    // 1. Category A → Z
    const cat = a.category.localeCompare(b.category);
    if (cat !== 0) return cat;

    // 2. Name A → Z
    const name = a.name.localeCompare(b.name);
    if (name !== 0) return name;

    // 3. Purchase Date oldest → newest (FIFO)
    return new Date(a.purchase_date) - new Date(b.purchase_date);
  });

useEffect(() => {
  if (highlightedRowId.length > 0) {
    const timeout = setTimeout(() => {
      setHighlightedRowId([]); //This removes yellow highlight
    });

    return () => clearTimeout(timeout);
  }
}, [highlightedRowId]);


  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleEditClick = (item) => {
    setEditRowId(item.ingredient_id);
    setEditData(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
  try {
    await axios.put(`/api/ingredients/${id}`, {
      name: editData.name,
      brand: editData.brand,
      unit: editData.unit,
      price: parseFloat(editData.price),
      quantity: parseFloat(editData.quantity),
      cost_per_unit: parseFloat(editData.cost_per_unit),
      purchase_date: editData.purchaseDate
    });

    if (parseFloat(editData.quantity) === 0) {
      await axios.delete(`/api/ingredients/${id}`);
    }

    setEditRowId(null);
    await fetchIngredients();
  } catch (err) {
    console.error("Update or delete failed:", err.response?.data || err.message);
  }
};


  const handleDelete = async (id) => {
    if (!id || typeof id !== "string") {
      console.warn("Invalid ingredient_id:", id);
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setDeletingId(id);
        await axios.delete(`/api/ingredients/${id}`);
        await fetchIngredients();
      } catch (err) {
        console.error(
          "Delete failed:",
          err.response?.data?.error || err.message
        );
        alert(
          `Error: ${err.response?.data?.error || "Check console for details"}`
        );
      } finally {
        setDeletingId(null);
      }
    }
  };

  //Modal Form Handlers
  const updateFormItem = (index, field, value) => {
    const updatedItems = [...formItems];
    updatedItems[index][field] = value;
    setFormItems(updatedItems);
  };

  const removeFormItem = (index) => {
    const updatedItems = [...formItems];
    updatedItems.splice(index, 1);
    setFormItems(updatedItems);
  };

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
        purchaseDate: "",
      },
    ]);
  };
const formatDate = (isoString) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  } catch {
    return "-";
  }
};

  const handleModalSave = async () => {
  try {
    if (!formItems || formItems.length === 0) return;

    const response = await axios.post("/api/ingredients/bulk", {
      items: formItems.map((item) => ({
        category: item.category,
        name: item.itemName,
        brand: item.brand,
        unit: item.unit,
        quantity: Number.parseFloat(item.quantity),
        price: Number.parseFloat(item.unitPrice),
        cost_per_unit: 0,
        purchase_date: item.purchaseDate,
      })),
    });

    const { newlyInserted, completelyNewIds } = response.data;

    setBoldRowId((prev) => [...prev, ...newlyInserted]); // permanent
    setHighlightedRowId(completelyNewIds); // temporary

    setShowModal(false);
    setFormItems([
      {
        category: "",
        itemName: "",
        brand: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        purchaseDate: "",
      },
    ]);

    await fetchIngredients(); // Refresh the inventory list

  } catch (err) {
    console.error("Error saving multiple items:", err.response?.data || err.message);
  }
};


  const groupedData = groupByCategory(ingredients);

  const getItemNamesByCategory = (category) => {
    return Array.from(
      new Set(
        ingredients.filter((i) => i.category === category).map((i) => i.name)
      )
    ).map((n) => ({
      label: n,
      value: n,
    }));
  };

  const getBrandsByCategoryAndItem = (category, itemName) => {
    return Array.from(
      new Set(
        ingredients
          .filter((i) => i.category === category && i.name === itemName)
          .map((i) => i.brand)
      )
    ).map((b) => ({ label: b, value: b }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Adds the Navbar component */}
      <Navbar activeTab="INVENTORY" />

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-[Marcellus] text-8xl sm:text-4xl font-bold text-amber-800">
            General Inventory
          </h2>
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
              <div
                key={category}
                className="bg-amber-100 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="cursor-pointer w-full px-6 py-4 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 flex justify-between items-center transition-all duration-200"
                >
                  <span className="text-lg font-semibold text-amber-900">
                    {category}
                  </span>
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
                              <th className="px-4 py-3 text-left font-semibold">
                                Item
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Brand
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Unit
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Price
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Cost/unit
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Purchase Date
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => {
                              const isEditing =
                                editRowId === item.ingredient_id;
                              return (
                                <tr
                                  key={item.ingredient_id}
                                  className={`transition-colors duration-300
                                    ${boldRowId.includes(item.ingredient_id) ? "font-bold" : ""}
                                    ${highlightedRowId.includes(item.ingredient_id) ? "bg-yellow-200" : ""}
                                  `}
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
                                        name="cost_per_unit"
                                        value={editData.cost_per_unit}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.00001"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.cost_per_unit
                                    )}
                                  </td>
                                  {/* <td className="px-4 py-3">
                                    {isEditing ? (
                                      <input
                                        name="cost_per_unit"
                                        value={editData.purc}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.00001"
                                        className="w-full bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      item.cost_per_unit
                                    )}
                                  </td> */}
                                  <td className="px-4 py-3">
                                    {formatDate(item.purchase_date)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                      {isEditing ? (
                                        <button
                                          onClick={() =>
                                            handleSave(item.ingredient_id)
                                          }
                                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() =>
                                              handleEditClick(item)
                                            }
                                            className="text-amber-600 hover:text-amber-800 transition-colors"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDelete(item.ingredient_id)
                                            }
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                          >
                                            {deletingId ===
                                            item.ingredient_id ? (
                                              <span className="text-xs text-gray-500 animate-pulse">
                                                Deleting...
                                              </span>
                                            ) : (
                                              <Trash2 className="w-4 h-4" />
                                            )}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-amber-700 text-center py-8">
                        No items in this category
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-amber-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-700 to-orange-900 px-8 py-2 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Add New Items
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-amber-200 transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[calc(95vh-200px)] overflow-y-auto overflow-x-hidden">
              <div className="space-y-8">
                {formItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-amber-100 hover:border-amber-200 transition-all duration-300"
                  >
                    {/* Item Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-amber-800">
                            Item {index + 1}
                          </h4>
                          <p className="text-amber-600 text-sm">
                            Enter the item details below
                          </p>
                        </div>
                      </div>
                      {formItems.length > 1 && (
                        <button
                          onClick={() => removeFormItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* Category */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <CreatableSelect
                          isClearable
                          placeholder="Select or create category..."
                          onChange={(selected) =>
                            updateFormItem(
                              index,
                              "category",
                              selected ? selected.value : ""
                            )
                          }
                          onCreateOption={(inputValue) =>
                            updateFormItem(index, "category", inputValue)
                          }
                          value={
                            item.category
                              ? { label: item.category, value: item.category }
                              : null
                          }
                          options={Array.from(
                            new Set(ingredients.map((i) => i.category))
                          ).map((c) => ({
                            label: c,
                            value: c,
                          }))}
                          styles={customSelectStyles}
                          classNamePrefix="react-select"
                        />
                      </div>

                      {/* Item Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Item Name <span className="text-red-500">*</span>
                        </label>
                        <CreatableSelect
                          isClearable
                          placeholder="Select or create item..."
                          onChange={(selected) => {
                            updateFormItem(
                              index,
                              "itemName",
                              selected ? selected.value : ""
                            );
                            updateFormItem(index, "brand", ""); // reset brand when item changes
                          }}
                          onCreateOption={(inputValue) =>
                            updateFormItem(index, "itemName", inputValue)
                          }
                          value={
                            item.itemName
                              ? { label: item.itemName, value: item.itemName }
                              : null
                          }
                          options={getItemNamesByCategory(item.category)}
                          styles={customSelectStyles}
                          classNamePrefix="react-select"
                          isDisabled={!item.category}
                        />
                        {!item.category && (
                          <p className="text-xs text-amber-600 mt-1">
                            Please select a category first
                          </p>
                        )}
                      </div>

                      {/* Brand */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Brand <span className="text-red-500">*</span>
                        </label>
                        <CreatableSelect
                          isClearable
                          placeholder="Select or create brand..."
                          onChange={(selected) =>
                            updateFormItem(
                              index,
                              "brand",
                              selected ? selected.value : ""
                            )
                          }
                          onCreateOption={(inputValue) =>
                            updateFormItem(index, "brand", inputValue)
                          }
                          value={
                            item.brand
                              ? { label: item.brand, value: item.brand }
                              : null
                          }
                          options={Array.from(
                            new Set(ingredients.map((i) => i.brand))
                          ).map((b) => ({
                            label: b,
                            value: b,
                          }))}
                          styles={customSelectStyles}
                          classNamePrefix="react-select"
                        />
                      </div>

                      {/* Unit */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Unit <span className="text-red-500">*</span>
                        </label>
                        <Select
                          placeholder="Select unit..."
                          options={[
                            { label: "Grams (g)", value: "g" },
                            { label: "Kilograms (kg)", value: "kg" },
                            { label: "Milliliters (ml)", value: "ml" },
                            { label: "Liters (l)", value: "l" },
                            { label: "Pieces (pc)", value: "pc" },
                          ]}
                          value={
                            item.unit
                              ? { label: item.unit, value: item.unit }
                              : null
                          }
                          onChange={(selected) =>
                            updateFormItem(
                              index,
                              "unit",
                              selected ? selected.value : ""
                            )
                          }
                          styles={customSelectStyles}
                          classNamePrefix="react-select"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateFormItem(index, "quantity", e.target.value)
                          }
                          className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200 text-amber-800 font-medium"
                          placeholder="Enter quantity..."
                          min="0"
                          step="0.01"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Unit Price (₱) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateFormItem(index, "unitPrice", e.target.value)
                          }
                          className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200 text-amber-800 font-medium"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {/* Purchase Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Purchase Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={item.purchaseDate}
                          onChange={(e) =>
                            updateFormItem(index, "purchaseDate", e.target.value)
                          }
                          className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200 text-amber-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-amber-200">
              <div className="text-sm text-amber-700">
                <span className="font-semibold">{formItems.length}</span> item
                {formItems.length !== 1 ? "s" : ""} ready to save
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addNewFormItem}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Item</span>
                </button>
                <button
                  type="button"
                  onClick={handleModalSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Save All Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;