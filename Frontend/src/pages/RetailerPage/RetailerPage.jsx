import React, { useEffect,useState } from "react";

import Sidebar from '../../Components/Restaurant/SideBar';
import Header from "../../Components/Restaurant/Header_1";
import FoodItemsTable from '../../Components/Restaurant/FoodItemsTable';
import AIRecipe from '../../Components/Restaurant/AIRecipe';
import NavBar from "../../Components/Restaurant/NavBar";
import Analytics from "../../Components/Restaurant/Analytics";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RetailerPage = () => {
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Retrieve success message
    const successMessage = localStorage.getItem("loginSuccess");

    if (successMessage) {
      toast.success(successMessage);

      // Remove the success message from localStorage
      localStorage.removeItem("loginSuccess");
    }

    // Retrieve accessToken and userId from localStorage
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedAccessToken && storedUserId) {
      console.log("Access Token:", storedAccessToken);
      console.log("User ID:", storedUserId);

      // Save them to state for later use
      setAccessToken(storedAccessToken);
      setUserId(storedUserId);
    }
  }, []);
  return (
    <div className="animate-fadeIn">
      <NavBar />
      <div className="flex ">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 p-6 bg-green-100">
          <Header />
          
          {/* Main content section with food items and AI Recipe */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <FoodItemsTable />
            </div>
            <AIRecipe />
          </div>

          {/* Analytics component */}
          <div className="mt-6">
            <Analytics />
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default RetailerPage;
