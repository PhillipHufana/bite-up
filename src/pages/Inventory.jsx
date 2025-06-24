import React, { useEffect, useState } from "react";
import axios from "axios";
import IngredientForm from "../components/createForm";

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/api/ingredients")
      .then((response) => {
        setIngredients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);


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
      <IngredientForm />
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
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.ingredient_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.brand}</td>
                      <td className="px-4 py-2 border">{item.unit}</td>
                      <td className="px-4 py-2 border">₱{item.price}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">{item.ml_to_gram_conversion}</td>
                      <td className="px-4 py-2 border">{item.cost_per_gram}</td>
                      <td className="px-4 py-2 border">{item.purchase_date}</td>
                    </tr>
                  ))}
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
