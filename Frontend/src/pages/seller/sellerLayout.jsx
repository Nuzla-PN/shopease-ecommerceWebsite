import { Outlet, NavLink, Link, useNavigate } from "react-router";

import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,  
  DollarSign, 
  Settings,
  ChevronDown,
  Store
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import { useState } from "react";

export function SellerLayout() {

    const [open,setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user =JSON.parse(localStorage.getItem("user"));
    const handleLogout = () =>{
        dispatch(logout());
        navigate("/login");
    }

  const navItems = [
    { path: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/seller/products", label: "Products", icon: Package },
    { path: "/seller/orders", label: "Orders", icon: ShoppingCart },
    { path: "/seller/payments", label: "Payments", icon: DollarSign },
   
  ];

  return (
    <div className="flex h-screen bg-gray-50">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/seller/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl text-gray-900">SellerHub</span>
          </Link>
        </div>

        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

    
      <div className="flex-1 flex flex-col overflow-hidden">
    
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">
          ShopKart
        </Link>
          
            <div className="relative">
                <button onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-gray-100 rounded-lg"
                >
                    <div className="text-right">
                    <div className="text-sm text-gray-900">
                        {user?.usernamebox || "Seller"}
                    </div>
                    <div className="text-xs text-gray-500">Seller</div>
                    </div>

                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {user?.usernamebox?.[0]?.toUpperCase() || "S"}
                    </div>

                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                
                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                    >
                        Logout
                    </button>
                    </div>
                )}
                </div>
        </header>

        
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
