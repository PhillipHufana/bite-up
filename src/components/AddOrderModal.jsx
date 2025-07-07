"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Button from "./ui/Button.jsx";
import Input from "./ui/Input.jsx";
import Label from "./ui/Label.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog.jsx";
import { Plus, Trash2 } from "lucide-react";

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

  const handleNameSearch = useCallback((firstName, lastName) => {
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
  }, [customers]);

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
            const match = products.find(
              (p) => p.name.toLowerCase() === value.toLowerCase()
            );
            if (match) updated.price = match.cost;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl max-h-[70vh] overflow-y-auto"
        style={{ backgroundColor: "#FEF2E5" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-center mb-4 mt-4 text-black">
            ADD NEW ORDER
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div>
              <Label className="font-poppins">Customer's First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className={`bg-[#D9D9D9] border-none ${
                  customerNotFound ? "ring-2 ring-red-400" : ""
                }`}
                required
              />
            </div>
            <div>
              <Label className="font-poppins">Customer's Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className={`bg-[#D9D9D9] border-none ${
                  customerNotFound ? "ring-2 ring-red-400" : ""
                }`}
                required
              />
            </div>

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
                    Customer not found! Add them in the Customer Profile first.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="font-poppins text-lg">Order Items</Label>
              <Button
                type="button"
                onClick={addOrderItem}
                className="bg-[#C1801C] hover:bg-[#A6670F] text-white px-3 py-1 rounded-full font-poppins text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>

            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#D9D9D9] rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-poppins font-semibold">
                    Item {index + 1}
                  </span>
                  {orderItems.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeOrderItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="font-poppins text-sm">Item Name</Label>
                    <input
                      list={`products-${item.id}`}
                      value={item.name}
                      onChange={(e) =>
                        updateOrderItem(item.id, "name", e.target.value)
                      }
                      className="bg-white border border-gray-300 rounded-md p-2 w-full"
                      required
                    />
                    <datalist id={`products-${item.id}`}>
                      {Array.isArray(products) &&
                        products.map((p, idx) => (
                          <option key={idx} value={p.name} />
                        ))}
                    </datalist>
                  </div>
                  <div>
                    <Label className="font-poppins text-sm">Quantity</Label>
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
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <Label className="font-poppins text-sm">Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      readOnly
                      className="bg-white border-gray-300 text-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-[#D9D9D9] rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-poppins text-lg font-semibold">
                  Total Amount:
                </span>
                <span className="font-poppins text-xl font-bold text-green-600">
                  P {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div>
            <Label className="font-poppins">Order Date</Label>
            <Input
              type="date"
              value={formData.orderDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  orderDate: e.target.value,
                }))
              }
              className="bg-[#D9D9D9] border-none"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#1F9254] hover:bg-green-700 text-white px-8 py-2 rounded-full font-poppins"
            >
              SAVE ORDER
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddOrderModal;
