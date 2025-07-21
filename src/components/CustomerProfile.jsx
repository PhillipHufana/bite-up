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

function CustomerProfile() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer");
      const data = await response.json();

      const customersWithHistory = await Promise.all(
        data.map(async (cust) => {
          const historyRes = await fetch(`/api/customer/${cust.customer_id}/orders`);
          const orderHistory = await historyRes.json();
          const totalSpent = orderHistory.reduce(
            (sum, order) => sum + parseFloat(order.total),
            0
          );

          return {
            id: cust.customer_id,
            name: `${cust.first_name} ${cust.last_name}`,
            phone: cust.contact_number,
            email: cust.email,
            address: cust.address,
            customerSince: new Date(
              cust.created_at || Date.now()
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            totalOrders: orderHistory.length,
            totalSpent: `P ${totalSpent.toFixed(2)}`,
            orderHistory: orderHistory,
          };
        })
      );

      setCustomers(
        customersWithHistory.sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2
        className="text-3xl font-marcellus mb-12 mt-3"
        style={{ color: "#702d05" }}
      >
        Customer Profile
      </h2>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-amber-100 border border-amber-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center cursor-pointer space-x-2"
        >
          ADD NEW +
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {filteredCustomers.map((customer) => (
          <AccordionItem
            key={customer.id}
            value={customer.id}
            className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl shadow-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback
                      style={{ backgroundColor: "#7b3306", color: "#fff" }}
                    >
                      {customer.name.split(" ")[0][0]}
                      {customer.name.split(" ")[1]?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-poppins font-semibold text-amber-900">
                      {customer.name}
                    </div>
                    <div className="text-sm font-poppins text-[#222]">
                      {customer.phone} {customer.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-poppins font-semibold text-amber-900">
                    {customer.address}
                  </div>
                  <div className="text-sm font-poppins text-[#222]">
                    Customer Since: {customer.customerSince || "N/A"}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "#fef3c6" }}
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
                    style={{ backgroundColor: "#fef3c6" }}
                  >
                    <div className="text-2xl font-bold text-green-600">
                      {customer.totalSpent}
                    </div>
                    <div className="font-poppins" style={{ color: "#222222" }}>
                      Total Spent
                    </div>
                  </div>
                </div>

                {customer.orderHistory.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="text-lg font-semibold font-poppins text-[#222]">
                      Order History
                    </div>
                    {customer.orderHistory.map((order, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-[rgba(255,255,255,0.3)] to-[rgba(200,200,200,0.15)] rounded-xl px-6 py-4"
                      >
                        <div className="mb-2">
                          <div className="font-poppins font-bold text-[#222]">
                            {order.order_id}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>

                        <div className="space-y-1 mb-2">
                          {(order.items || "").split(", ").map((item, idx) => {
                            const match = item.match(
                              /^(\d+)x (.+?) @ ([\d.]+)$/
                            );
                            if (!match) return <div key={idx}>{item}</div>;
                            const [, qty, name, subtotal] = match;
                            return (
                              <div
                                key={idx}
                                className="flex justify-between font-poppins text-[#222]"
                              >
                                <span>{`${qty}x ${name}`}</span>
                                <span className="font-semibold">
                                  P {subtotal}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm text-red-900 font-bold">
                            {order.status}
                          </div>
                          <div className="text-green-600 font-bold text-xl">
                            P {parseFloat(order.total).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
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
        fetchCustomers={fetchCustomers}
      />
    </div>
  );
}

export default CustomerProfile;
