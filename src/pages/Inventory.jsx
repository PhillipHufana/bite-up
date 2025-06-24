import React, { useEffect, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    axios.get("http://localhost:3001/api/ingredients")
      .then((response) => {
        setIngredients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this ingredient?");
  if (!confirmDelete) return;

  console.log("Deleting ID:", id);

  try {
    const res = await axios.delete(`http://localhost:3001/api/ingredients/${id}`);
    console.log("Delete response:", res.data);
    if (res.data.success) {
      setIngredients((prev) =>
        prev.filter((item) => item.ingredient_id !== id)
      );
    } else {
      alert("Failed to delete.");
    }
  } catch (err) {
    console.error("Delete request error:", err.response?.data || err.message);
    alert("Error occurred while deleting.");
  }
};


  const handleEditClick = (item) => {
    setEditRowId(item.ingredient_id);
    setEditData(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:3001/api/ingredients/${id}`, editData)
      .then(() => {
        setEditRowId(null);
        fetchIngredients();
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  };

  const groupedByCategory = ingredients.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Inventory Table</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-green-700">{category}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Brand</th>
                    <th className="px-4 py-2 border">Unit</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">mL to g</th>
                    <th className="px-4 py-2 border">Cost/g</th>
                    <th className="px-4 py-2 border">Purchase Date</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isEditing = item.ingredient_id === editRowId;
                    return (
                      <tr key={item.ingredient_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="name" value={editData.name} onChange={handleChange} />
                          ) : item.name}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="brand" value={editData.brand} onChange={handleChange} />
                          ) : item.brand}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="unit" value={editData.unit} onChange={handleChange} />
                          ) : item.unit}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="price" value={editData.price} onChange={handleChange} />
                          ) : `₱${item.price}`}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="quantity" value={editData.quantity} onChange={handleChange} />
                          ) : item.quantity}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="ml_to_gram_conversion" value={editData.ml_to_gram_conversion} onChange={handleChange} />
                          ) : item.ml_to_gram_conversion}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="cost_per_gram" value={editData.cost_per_gram} onChange={handleChange} />
                          ) : item.cost_per_gram}
                        </td>
                        <td className="px-4 py-2 border">
                          {isEditing ? (
                            <input name="purchase_date" value={editData.purchase_date} onChange={handleChange} />
                          ) : item.purchase_date}
                        </td>
                        <td className="px-4 py-2 border space-x-1">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(item.ingredient_id)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditClick(item)}
                              className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.ingredient_id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Inventory;
