import React, { useState } from "react";
import axios from "axios";

const IngredientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    unit: "",
    price: "",
    quantity: "",
    ml_to_gram_conversion: "",
    cost_per_gram: "",
    purchase_date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/ingredients", formData);
      alert("Ingredient added successfully!");
      // Reset form
      setFormData({
        name: "",
        category: "",
        brand: "",
        unit: "",
        price: "",
        quantity: "",
        ml_to_gram_conversion: "",
        cost_per_gram: "",
        purchase_date: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add ingredient. Check the console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Add New Ingredient</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Required Fields */}
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required />
        <input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g., g, ml)" required />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" required />
        <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" step="0.01" required />
        <input name="purchase_date" value={formData.purchase_date} onChange={handleChange} type="date" required />

        {/* Optional Fields */}
        <input name="ml_to_gram_conversion" value={formData.ml_to_gram_conversion} onChange={handleChange} placeholder="ml/g conversion" type="number" step="0.01" />
        <input name="cost_per_gram" value={formData.cost_per_gram} onChange={handleChange} placeholder="Cost per gram" type="number" step="0.0001" />
      </div>
      <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Add Ingredient
      </button>
    </form>
  );
};

export default IngredientForm;