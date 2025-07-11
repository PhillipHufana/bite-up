"use client";

import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Input from "./ui/Input.jsx";

function AddCustomerModal({ isOpen, onClose, fetchCustomers }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        contact_number: formData.contactNumber,
        email: formData.email,
        address: formData.address,
      };

      await axios.post("/api/customer", payload);
      fetchCustomers(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error("Failed to add customer:", err.response?.data || err);
      alert(
        err.response?.data?.error || "Error saving customer. Please try again."
      );
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[70vh] overflow-hidden border flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-700 to-orange-900 px-8 py-2 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Add New Customer
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-amber-200 transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              id="addCustomerForm"
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto flex-1 space-y-8"
            >
              <div className="flex gap-6">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-amber-300 rounded-xl px-4 py-2 text-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-amber-300 rounded-xl px-4 py-2 text-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-amber-300 rounded-xl px-4 py-2 text-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-amber-800">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-amber-300 rounded-xl px-4 py-2 text-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-800">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-amber-300 rounded-xl px-4 py-2 text-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </form>

            {/* Footer (Fixed at bottom) */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-amber-200">
              <div className="text-sm text-amber-700"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  form="addCustomerForm"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Save Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default AddCustomerModal;
