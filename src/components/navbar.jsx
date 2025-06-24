"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, Calculator, Package, FileText } from "lucide-react"

const Navbar = ({ activeTab = "INVENTORY" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      name: "ORDER",
      icon: ShoppingCart,
      path: "/order",
    },
    {
      name: "COSTING",
      icon: Calculator,
      path: "/costing",
    },
    {
      name: "INVENTORY",
      icon: Package,
      path: "/inventory",
    },
    {
      name: "RECORDS",
      icon: FileText,
      path: "/records",
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const handleLogoClick = () => {
    navigate("/") // Navigate to main page (App.jsx)
  }

  return (
    <nav className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-800 shadow-xl sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="BiteUP Logo"
              className="h-12 w-auto sm:h-12 lg:h-12 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = location.pathname === item.path || activeTab === item.name

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base
                    transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? "bg-amber-700 text-white shadow-lg backdrop-blur-sm"
                        : "text-amber-100 hover:text-white hover:bg-amber-700 cursor-pointer hover:bg-opacity-10"
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{item.name}</span>
                  <span className="lg:hidden">{item.name}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-amber-200 focus:outline-none cursor-pointer focus:text-amber-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black bg-opacity-10 backdrop-blur-sm rounded-lg mt-2 mb-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                const isActive = location.pathname === item.path || activeTab === item.name

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg font-semibold text-base w-full text-left
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-white bg-opacity-20 text-white shadow-md"
                          : "text-amber-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
