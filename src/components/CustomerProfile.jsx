"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button.jsx";
import Input from "./ui/Input.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion.jsx";
import { Avatar, AvatarFallback } from "./ui/Avatar.jsx";
import AddCustomerModal from "./AddCustomerModal.jsx";

export default function CustomerProfile() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  // Load customers from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem("biteup-customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Initialize with mock data
      const mockCustomers = [
        {
          id: "1",
          name: "Abot, Gracie",
          phone: "0912 345 6789",
          email: "grabot@gmail.com",
          address: "Sitio Basak, Mintal, Davao City",
          customerSince: "November 11, 2024",
          totalOrders: 1,
          totalSpent: "P 350.00",
          orderHistory: [],
        },
        {
          id: "2",
          name: "Pasaporte, Melvine",
          phone: "0912 345 6789",
          email: "ms@gmail.com",
          address: "TTBDO, Davao City",
          customerSince: "January 23, 2025",
          totalOrders: 1,
          totalSpent: "P 3,250.00",
          orderHistory: [],
        },
      ];
      setCustomers(mockCustomers);
      localStorage.setItem("biteup-customers", JSON.stringify(mockCustomers));
    }
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (newCustomerData) => {
    const newCustomer = {
      ...newCustomerData,
      id: Date.now().toString(),
      customerSince: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      totalOrders: 0,
      totalSpent: "P 0.00",
      orderHistory: [],
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem("biteup-customers", JSON.stringify(updatedCustomers));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h2
        className="text-3xl font-marcellus  mb-12 mt-3"
        style={{ color: "#444444" }}
      >
        Customer Profile
      </h2>
      {/* Search and Add */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-[rgba(68,68,68,0.15)] text-[#444444] border-none rounded-lg"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="text-white px-6 py-2 rounded-full font-poppins transition-all duration-300"
          style={{ backgroundColor: "#C1801C" }}
        >
          ADD NEW +
        </Button>
      </div>

      {/* Customer List */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredCustomers.map((customer) => (
          <AccordionItem
            key={customer.id}
            value={customer.id}
            className="bg-[rgba(68,68,68,0.09)] rounded-xl"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback
                      style={{ backgroundColor: "#42392C", color: "#FFF1C0" }}
                    >
                      {customer.name.split(" ")[0][0]}
                      {customer.name.split(" ")[1]?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div
                      className="font-poppins font-semibold"
                      style={{ color: "#222222" }}
                    >
                      {customer.name}
                    </div>
                    <div className="text-sm font-poppins text-gray-600">
                      {customer.phone} {customer.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-poppins font-semibold"
                    style={{ color: "#222222" }}
                  >
                    {customer.address}
                  </div>
                  <div className="text-sm font-poppins text-gray-600">
                    Customer Since: {customer.customerSince}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex space-x-4">
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "rgba(141, 120, 103, 0.25)" }}
                  >
                    <div className="text-2xl font-bold text-red-600">
                      {customer.totalOrders}
                    </div>
                    <div className="font-poppins" style={{ color: "#222222" }}>
                      Total Orders
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "rgba(141, 120, 103, 0.25)" }}
                  >
                    <div className="text-2xl font-bold text-green-600">
                      {customer.totalSpent}
                    </div>
                    <div className="font-poppins" style={{ color: "#222222" }}>
                      Total Spent
                    </div>
                  </div>
                </div>

                {/* Order History */}
                {customer.orderHistory.length > 0 && (
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                  >
                    {/* Header */}
                    <div
                      className="px-4 py-3"
                      style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}
                    >
                      <h3 className="font-poppins font-semibold text-white">
                        Order History
                      </h3>
                    </div>
                    {/* Body */}
                    <div className="p-4 space-y-4">
                      {customer.orderHistory.map((order, index) => (
                        <div
                          key={index}
                          className="rounded-lg p-4 hover:bg-opacity-25 transition-colors duration-200"
                          style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div
                                className="font-poppins font-semibold"
                                style={{ color: "#222222" }}
                              >
                                {order.orderCode}
                              </div>
                              <div className="text-sm font-poppins text-gray-500">
                                {order.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {order.total}
                              </div>
                              <div className="text-sm font-poppins text-green-600">
                                {order.status}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex justify-between font-poppins"
                                style={{ color: "#222222" }}
                              >
                                <span>{item}</span>
                                <span>{order.itemCosts[itemIndex]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  );
}
