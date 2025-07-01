"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/navbar"
import AddOrderModal from "../components/AddOrderModal"

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterDate, setFilterDate] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [orderBy, setOrderBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders")
      const formatted = res.data.map((order) => {
        const dateObj = new Date(order.delivery_date)
        return {
          id: order.id,
          customerId: order.customer_id,
          firstName: order.first_name,
          lastName: order.last_name,
          order: order.order_name,
          rawDate: dateObj,
          orderDate: isNaN(dateObj)
            ? "Invalid date"
            : dateObj.toLocaleDateString("en-GB"),
          total: parseFloat(order.total || 0).toFixed(2),
        }
      })
      setOrders(formatted)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customer")
      const data = res.data.map((cust) => ({
        id: cust.customer_id,
        name: `${cust.last_name}, ${cust.first_name}`,
        phone: cust.contact_number,
        email: cust.email,
        address: cust.address,
      }))
      setCustomers(data)
    } catch (err) {
      console.error("Failed to fetch customers:", err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [])

  useEffect(() => {
    let filtered = [...orders]
    if (filterDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate.split("/").reverse().join("-"))
        const filterDateObj = new Date(filterDate)
        return orderDate.toDateString() === filterDateObj.toDateString()
      })
    }

    filtered.sort((a, b) => {
      let comp = 0
      if (sortBy === "name") {
        comp = a.firstName.localeCompare(b.firstName)
      } else if (sortBy === "date") {
        comp = a.rawDate - b.rawDate
      } else if (sortBy === "cost") {
        comp = a.total - b.total
      }
      return orderBy === "newest" ? -comp : comp
    })

    setFilteredOrders(filtered)
  }, [orders, filterDate, sortBy, orderBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar activeTab="ORDERS" />

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-[Marcellus] text-8xl sm:text-4xl font-bold text-amber-800">Orders</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center cursor-pointer space-x-2"
          >
            <span>ADD ORDER</span>
            <span className="text-lg">+</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-semibold text-amber-900">Filter by Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-amber-900">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="cost">Cost</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-amber-900">Order</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-amber-700 ml-4 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-200 text-amber-900 font-semibold">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">Last Name</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="odd:bg-white even:bg-amber-50 hover:bg-amber-100 transition">
                    <td className="px-6 py-4">{order.id}</td>
                    <td className="px-6 py-4">{order.firstName}</td>
                    <td className="px-6 py-4">{order.lastName}</td>
                    <td className="px-6 py-4">{order.order}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">₱{order.total}</td>
                    <td className="px-6 py-4">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddOrder={fetchOrders}
          customers={customers}
        />
      </main>
    </div>
  )
}

export default Orders
