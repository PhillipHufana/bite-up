"use client";

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = ["ORDER", "COSTING", "INVENTORY", "RECORDS"];

  return (
    <nav className="w-full px-6 py-4" style={{ backgroundColor: "#42392C" }}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center">
          <img
            src="/images/bite_up_logo-removebg-preview.png"
            alt="BiteUP Logo"
            className="h-12 w-auto"
          />
        </div>

        <div className="flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-white font-poppins text-lg font-medium hover:text-yellow-300 ${
                activeTab === item ? "text-yellow-300" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
