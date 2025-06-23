"use client";

import { useState } from "react";
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

export default function AddOrderModal({
  isOpen,
  onClose,
  onAddOrder,
  customers,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    deliveryDate: "",
  });
  const [orderItems, setOrderItems] = useState([
    { id: "1", name: "", quantity: 1, price: 0 },
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleNameSearch = (firstName, lastName) => {
    if (firstName.length > 0 || lastName.length > 0) {
      const results = customers.filter((customer) => {
        const fullName = customer.name.toLowerCase();
        const searchFirst = firstName.toLowerCase();
        const searchLast = lastName.toLowerCase();

        return fullName.includes(searchFirst) && fullName.includes(searchLast);
      });
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleFirstNameChange = (value) => {
    setFormData({ ...formData, firstName: value });
    handleNameSearch(value, formData.lastName);
  };

  const handleLastNameChange = (value) => {
    setFormData({ ...formData, lastName: value });
    handleNameSearch(formData.firstName, value);
  };

  const selectCustomer = (customer) => {
    const [lastName, firstName] = customer.name.split(", ");
    setFormData({
      ...formData,
      firstName: firstName || "",
      lastName: lastName || "",
    });
    setShowResults(false);
  };

  const addOrderItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    }
  };

  const updateOrderItem = (id, field, value) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if customer exists
    const customerExists = customers.some((customer) => {
      const fullName = customer.name.toLowerCase();
      const searchName = `${formData.lastName.toLowerCase()}, ${formData.firstName.toLowerCase()}`;
      return (
        fullName === searchName ||
        (fullName.includes(formData.firstName.toLowerCase()) &&
          fullName.includes(formData.lastName.toLowerCase()))
      );
    });

    if (!customerExists) {
      alert(
        "Customer not found! Please add the customer to the Customer Profile first."
      );
      return;
    }

    // Validate order items
    const validItems = orderItems.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0 && item.price > 0
    );
    if (validItems.length === 0) {
      alert("Please add at least one valid order item.");
      return;
    }

    const total = calculateTotal();
    const orderDescription = validItems
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    const newOrder = {
      ...formData,
      order: orderDescription,
      orderItems: validItems,
      total: `P ${total.toFixed(2)}`,
      status: "Pending",
    };

    onAddOrder(newOrder);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      deliveryDate: "",
    });
    setOrderItems([{ id: "1", name: "", quantity: 1, price: 0 }]);
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl max-h-[70vh] overflow-y-auto"
        style={{ backgroundColor: "#FEF2E5" }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-poppins text-center mb-4 mt-4"
            style={{ color: "#000000" }}
          >
            ADD NEW ORDER
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 relative">
            <div>
              <Label className="font-poppins" style={{ color: "#000000" }}>
                Customer's First Name
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className="bg-[#D9D9D9] border-none"
                required
              />
            </div>
            <div>
              <Label className="font-poppins" style={{ color: "#000000" }}>
                Customer's Last Name
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className="bg-[#D9D9D9] border-none"
                required
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {searchResults.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer font-poppins"
                    onClick={() => selectCustomer(customer)}
                  >
                    {customer.name}
                  </div>
                ))}
              </div>
            )}

            {showResults &&
              searchResults.length === 0 &&
              formData.firstName &&
              formData.lastName && (
                <div className="absolute top-full left-0 right-0 z-10 bg-red-100 border border-red-300 rounded-md p-2">
                  <p className="text-red-600 font-poppins text-sm">
                    Customer not found! Please add to Customer Profile first.
                  </p>
                </div>
              )}
          </div>

          {/* Order Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label
                className="font-poppins text-lg"
                style={{ color: "#000000" }}
              >
                Order Items
              </Label>
              <Button
                type="button"
                onClick={addOrderItem}
                className="bg-[#C1801C] hover:bg-[#A6670F] text-white px-3 py-1 rounded-full font-poppins text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#D9D9D9] rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-poppins font-semibold"
                    style={{ color: "#000000" }}
                  >
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
                    <Label
                      className="font-poppins text-sm"
                      style={{ color: "#444444" }}
                    >
                      Item Name
                    </Label>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        updateOrderItem(item.id, "name", e.target.value)
                      }
                      className="bg-white border-gray-300"
                      placeholder="e.g., Cinnamon Roll"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      className="font-poppins text-sm"
                      style={{ color: "#444444" }}
                    >
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateOrderItem(
                          item.id,
                          "quantity",
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      className="font-poppins text-sm"
                      style={{ color: "#444444" }}
                    >
                      Price (each)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateOrderItem(
                          item.id,
                          "price",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className="bg-white border-gray-300"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="font-poppins font-semibold"
                    style={{ color: "#000000" }}
                  >
                    Subtotal: P {(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-[#D9D9D9] rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span
                  className="font-poppins text-lg font-semibold"
                  style={{ color: "#000000" }}
                >
                  Total Amount:
                </span>
                <span className="font-poppins text-xl font-bold text-green-600">
                  P {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="font-poppins" style={{ color: "#000000" }}>
              Delivery Date
            </Label>
            <Input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              className="bg-[#D9D9D9] border-none"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-[#1F9254] hover:bg-green-700 text-white px-8 py-2 rounded-full font-poppins"
            >
              SAVE ORDER
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
