"use client";

import { useState } from "react";
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

      await axios.post("/api/customer", payload); // ✅ correct route

      fetchCustomers(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error("Failed to add customer:", err.response?.data || err);
      alert(err.response?.data?.error || "Error saving customer. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg"
        style={{ backgroundColor: "#FEF2E5" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-center mt-4 mb-2">
            ADD CUSTOMER PROFILE
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-poppins">First Name</Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="bg-[#D9D9D9] border-none"
            />
          </div>

          <div>
            <Label className="font-poppins">Last Name</Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="bg-[#D9D9D9] border-none"
            />
          </div>

          <div>
            <Label className="font-poppins">Contact Number</Label>
            <Input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              type="tel"
              required
              className="bg-[#D9D9D9] border-none"
            />
          </div>

          <div>
            <Label className="font-poppins">Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="bg-[#D9D9D9] border-none"
            />
          </div>

          <div>
            <Label className="font-poppins">Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="bg-[#D9D9D9] border-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-[#1F9254] hover:bg-green-700 text-white px-8 py-2 rounded-full font-poppins"
            >
              SAVE CUSTOMER
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCustomerModal;
