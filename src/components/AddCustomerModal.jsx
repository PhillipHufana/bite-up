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

export default function AddCustomerModal({ isOpen, onClose, fetchCustomers }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/customer", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        contact_number: formData.phone,
        email: formData.email,
      });

      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        email: "",
      });

      onClose();
      fetchCustomers(); // Refresh customer table
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
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
            ADD NEW CUSTOMER
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
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="bg-[#D9D9D9] border-none"
                required
              />
            </div>
          </div>
          <div>
            <Label className="font-poppins" style={{ color: "#000000" }}>
              Address
            </Label>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="bg-[#D9D9D9] border-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-poppins" style={{ color: "#000000" }}>
                Contact Number
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-[#D9D9D9] border-none"
                required
              />
            </div>
            <div>
              <Label className="font-poppins" style={{ color: "#000000" }}>
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-[#D9D9D9] border-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full font-poppins"
            >
              SAVE
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
