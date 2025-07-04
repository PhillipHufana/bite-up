import { Link } from "react-router-dom"
import { ClipboardList, Calculator, FolderOpen, Edit3, Cookie } from "lucide-react"

const App = () => {
  const menuItems = [
    {
      icon: <ClipboardList size={32} />,
      label: "Inventory",
      path: "/inventory",
      description: "Manage your bakery stock",
      color: "from-[#C1801C] to-[#D8A04B]",
    },
    {
      icon: <Calculator size={32} />,
      label: "Costing Calculator",
      path: "/costingcalculator",
      description: "View total food costing",
      color: "from-[#D8A04B] to-[#C1801C]",
    },
    {
      icon: <FolderOpen size={32} />,
      label: "Records",
      path: "/records",
      description: "View records and manage customer profile",
      color: "from-[#C1801C] to-[#D8A04B]",
    },
    {
      icon: <Edit3 size={32} />,
      label: "Orders",
      path: "/orders",
      description: "Manage customer orders",
      color: "from-[#D8A04B] to-[#C1801C]",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-6 mt-1">
              <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-4 rounded-full shadow-lg mr-4">
                <Cookie size={48} className="text-white" />
              </div>
              <div className="text-left">
                <img src="../public/logo.png" alt="BiteUP Logo" className="w-60" />
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Title and Subtitle */}
            <h2 className="text-4xl font-bold font-[Marcellus] text-amber-900 mb-3 mt-8">Bakery Management System</h2>
            <p className="text-lg text-amber-700/80 mb-2 font-[Poppins]">Hello, Admin! What would you like to do today?</p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Menu Cards Section */}
      <div className="px-8 pb-5 pt-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="group relative bg-[#F9F6ED] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Card Content */}
                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {item.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default App