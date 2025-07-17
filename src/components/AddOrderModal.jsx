"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { X, Plus, Trash2 } from "lucide-react";
import Input from "./ui/Input.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog.jsx";

function AddOrderModal({ isOpen, onClose, onAddOrder, customers }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    orderDate: "",
  });

  const [orderItems, setOrderItems] = useState([
    { id: "1", name: "", quantity: 1, price: 0 },
  ]);

  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [customerNotFound, setCustomerNotFound] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("/api/orders/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const handleNameSearch = useCallback(
    (firstName, lastName) => {
      const results = customers.filter((c) => {
        const fullName = c.name.toLowerCase();
        return (
          fullName.includes(firstName.toLowerCase()) &&
          fullName.includes(lastName.toLowerCase())
        );
      });
      setSearchResults(results);
      setShowResults(true);
      setCustomerNotFound(results.length === 0 && (firstName || lastName));
    },
    [customers]
  );

  const handleFirstNameChange = (value) => {
    setFormData((prev) => ({ ...prev, firstName: value }));
    handleNameSearch(value, formData.lastName);
  };

  const handleLastNameChange = (value) => {
    setFormData((prev) => ({ ...prev, lastName: value }));
    handleNameSearch(formData.firstName, value);
  };

  const selectCustomer = (customer) => {
    const [lastName, firstName] = customer.name.split(", ");
    setFormData((prev) => ({
      ...prev,
      firstName: firstName || "",
      lastName: lastName || "",
    }));
    setShowResults(false);
    setCustomerNotFound(false);
  };

  const addOrderItem = () => {
    setOrderItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", quantity: 1, price: 0 },
    ]);
  };

  const removeOrderItem = (id) => {
    if (orderItems.length > 1) {
      setOrderItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const updateOrderItem = (id, field, value) => {
    setOrderItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "name") {
            updated.name = value;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (item.quantity * (isNaN(price) ? 0 : price));
    }, 0);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const customer = customers.find((c) => {
      const fullName = c.name.toLowerCase();
      return (
        fullName.includes(formData.firstName.toLowerCase()) &&
        fullName.includes(formData.lastName.toLowerCase())
      );
    });

    if (!customer) {
      alert("Customer not found! Please add them to the Customer Profile.");
      return;
    }

    const validItems = orderItems.filter(
      (i) =>
        i.name &&
        i.quantity > 0 &&
        products.some((p) => p.name.toLowerCase() === i.name.toLowerCase())
    );

    if (validItems.length === 0) {
      alert("Please add valid products that exist in the system.");
      return;
    }

    try {
      const payload = {
        customer_id: customer.id,
        orderItems: validItems,
        total_amount: calculateTotal(),
        order_date: formData.orderDate,
      };
      await axios.post("/api/orders", payload);

      alert("Order saved and ingredients deducted!");
      onAddOrder?.();
      onClose();
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message);
      alert("Failed to save order.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden border border-amber-200 flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-700 to-orange-900 px-8 py-2 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Add New Order</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-amber-200 transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* Customer Info */}
              <div className="flex items-start gap-6 relative">
                {/* First Name */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    Customer's First Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    list="customerFirstNames"
                    value={formData.firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    className={`w-full border border-amber-200 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      customerNotFound ? "ring-2 ring-red-400" : ""
                    }`}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    Customer's Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    list="customerLastNames"
                    value={formData.lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    className={`w-full border border-amber-200 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      customerNotFound ? "ring-2 ring-red-400" : ""
                    }`}
                    required
                  />
                </div>

                {/* Search Results */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer font-poppins"
                          onClick={() => selectCustomer(customer)}
                        >
                          {customer.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-red-600 font-poppins">
                        Customer not found! Add them in the Customer Profile
                        first.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Items */}
              {orderItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-amber-100 hover:border-amber-200 transition-all duration-300"
                >
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
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Item Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        list={`products-${item.id}`}
                        value={item.name}
                        onChange={(e) =>
                          updateOrderItem(item.id, "name", e.target.value)
                        }
                        className="w-full border border-amber-300 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        required
                      />
                      <datalist id={`products-${item.id}`}>
                        {products.map((p, idx) => (
                          <option key={idx} value={p.name} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateOrderItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full border border-amber-300 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={item.price}
                        onChange={(e) =>
                          updateOrderItem(item.id, "price", e.target.value)
                        }
                        className="w-full border border-amber-300 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderDate: e.target.value,
                    }))
                  }
                  className="w-full border border-amber-200 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-inner border border-amber-100">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-amber-800">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-green-700">
                  ₱ {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-amber-200">
              <div className="text-sm text-amber-700">
                <span className="font-semibold">{orderItems.length}</span>{" "}
                {orderItems.length === 1 ? "item" : "items"} ready to save
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Save All Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddOrderModal;
