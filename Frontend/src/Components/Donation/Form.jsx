import React, { useState } from 'react';
import { FaHotel } from "react-icons/fa6";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { FaTractor } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
const Login = () => {
  const [retailerState, setRetailerState] = useState("login");
  const [consumerState, setConsumerState] = useState("login");
  const [ngoState, setNgoState] = useState("login");
  const [volunteerState, setVolunteerState] = useState("login");

  const [consumerEmail, setConsumerEmail] = useState("");
  const [consumerPassword, setConsumerPassword] = useState("");
  const [consumerUsername, setConsumerUsername] = useState("");

  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoPassword, setNgoPassword] = useState("");
  const [ngoUsername, setNgoUsername] = useState("");

  const [retailerEmail, setRetailerEmail] = useState("");
  const [retailerPassword, setRetailerPassword] = useState("");
  const [retailerUsername, setRetailerUsername] = useState("");

  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerPassword, setVolunteerPassword] = useState("");
  const [volunteerUsername, setVolunteerUsername] = useState("");


 

  const navigate = useNavigate()
  // const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
  
   
    if (!consumerEmail || !consumerPassword || (consumerState === "signup" && !consumerUsername)) {
      toast.error("Please fill in all the fields");
      return;
    }
  
    const userData = consumerState === "signup"
      ? { email: consumerEmail, password: consumerPassword, username: consumerUsername }
      : { email: consumerEmail, password: consumerPassword };
  
    console.log("Submitting Consumer Data:", userData);
  
    try {
      const response = await axios.post("/api/v1/users/login", userData);
  
      if (response.status === 200) {
        const data = response.data;
        console.log("Response Data:", data.data);


        try {
          localStorage.setItem("foodItems", JSON.stringify(data.data.updatedFoodItems)); 
          console.log("Full response data saved to localStorage:", data.data.updatedFoodItems);
        } catch (error) {
          console.error("Error saving data to localStorage:", error);
        }
  
        // if (data.updatedFoodItems && Array.isArray(data.updatedFoodItems)) {
        //   const formattedFoodItems = data.updatedFoodItems.map(item => ({
        //    expiryDate:item.expiryDate,
        //    manufacturingDate:item.manufacturingDate,
        //    name:item.name,
        //    status:item.status,

        //   }));
  
        //   // Store the formatted food items in localStorage
        //   localStorage.setItem("foodItems", JSON.stringify(formattedFoodItems));
        //   console.log("Formatted food items saved to localStorage:", formattedFoodItems);
        // } else {
        //   console.warn("No valid updated food items or not in array format.", data.updatedFoodItems);
        // }
  
        // Store other relevant data
        localStorage.setItem("loginSuccess", "Logged in Successfully !");
        localStorage.setItem("userEmail", consumerEmail);
  
        toast.success("Logged in Successfully");
  
        setTimeout(() => {
          navigate("/consumer");
        }, 1000);
      } else {
        console.error("Error:", response.statusText);
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("Invalid Credentials");
    } finally {
      setConsumerEmail("");
      setConsumerPassword("");
      if (consumerState === "signup") setConsumerUsername("");
    }
  };
  
  


  const ngoSubmitHandler = async (e) => {
    e.preventDefault();
    const ngoData = ngoState === "signup"
      ? { email: ngoEmail, password: ngoPassword, username: ngoUsername }
      : { email: ngoEmail, password: ngoPassword };

    console.log("Submitting NGO Data:", ngoData);
    try {
      const response = await axios.post(
        "/api/v1/ngos/login",
        ngoData
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Response Data:", data);
  
        // Store success message in localStorage
        localStorage.setItem("loginSuccess", "Logged in Successfully !");
        localStorage.setItem("userEmail", ngoEmail);
  
        // Display the toast success message before navigating
        toast.success("Logged in Successfully");
  
        // Delay the navigation to ensure toast shows up
        setTimeout(() => {
          navigate("/ngo");
        }, 1000); // Adjust the timeout as needed (e.g., 1500ms = 1.5s)
      } else {
        console.error("Error:", response.statusText);
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("Invalid Credentials");
    } finally {
      setNgoEmail("");
      setNgoPassword("");
      if (ngoState === "signup") setNgoUsername("");
    }
  };

  const retailerSubmitHandler = async (e) => {
    e.preventDefault();
  
    const retailerData =
      retailerState === "signup"
        ? { email: retailerEmail, password: retailerPassword, username: retailerUsername }
        : { email: retailerEmail, password: retailerPassword };
  
    console.log("Submitting Retailer Data:", retailerData);
  
    try {
      const response = await axios.post("/api/v1/restaurants/login", retailerData);
  
      if (response.status === 200) {
        const data = response.data;
        console.log("Response Data:", data);
  
        // Store the token and user data in localStorage
        localStorage.setItem("accessToken", data.data.accessToken); // Store accessToken
        localStorage.setItem("userId", data.data.user._id); // Store user ID
        localStorage.setItem("userEmail", data.data.user.name); // Store user email
      
        localStorage.setItem("loginSuccess", "Logged in Successfully!");
        localStorage.setItem("data", data);
  
        // Display the toast success message before navigating
        toast.success("Logged in Successfully");
  
        // Delay the navigation to ensure toast shows up
        setTimeout(() => {
          navigate("/retailer");
        }, 1000); // Adjust the timeout as needed (e.g., 1500ms = 1.5s)
      } else {
        console.error("Error:", response.statusText);
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("Invalid Credentials");
    } finally {
      // Reset form fields
      setRetailerEmail("");
      setRetailerPassword("");
      if (retailerState === "signup") setRetailerUsername(""); // Clear username only for signup
    }
  };

  const volunteerSubmitHandler = async (e) => {
    e.preventDefault();
  
    const volunteerData =
      retailerState === "signup"
        ? { email: volunteerEmail, password: volunteerPassword, username: volunteerUsername }
        : { email: volunteerEmail, password: volunteerPassword };
  
    console.log("Submitting volunteer Data:", volunteerData);
  
    try {
      const response = await axios.post("/api/v1/volunteers/login", volunteerData);
  
      if (response.status === 200) {
        const data = response.data;
        console.log("Response Data:", data);
  
        // Store the token and user data in localStorage
        localStorage.setItem("accessToken", data.data.accessToken); // Store accessToken
        localStorage.setItem("userId", data.data.loggedInUser._id); // Store user ID
        localStorage.setItem("userEmail", data.data.loggedInUser.email); // Store user email
        localStorage.setItem("userName", data.data.loggedInUser.name); // Store user name

        localStorage.setItem("loginSuccess", "Logged in Successfully!");
        localStorage.setItem("data", JSON.stringify(data));
  
        // Display the toast success message before navigating
        toast.success("Logged in Successfully");
  
        // Delay the navigation to ensure toast shows up
        setTimeout(() => {
          navigate("/volunteer");
        }, 1000); // Adjust the timeout as needed (e.g., 1500ms = 1.5s)
      } else {
        console.error("Error:", response.statusText);
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("Invalid Credentials");
    } finally {
      // Reset form fields
      setVolunteerEmail("");
      setVolunteerPassword("");
      if (volunteerState === "signup") setVolunteerUsername(""); // Clear username only for signup
    }
  };
  

  

  const toggleFormState = (role) => {
    if (role === "retailer") {
      setRetailerState(retailerState === "login" ? "signup" : "login");
    } else if (role === "consumer") {
      setConsumerState((prevState) =>
        prevState === "login" ? "signup" : "login"
      );
    } else if (role === "ngo") {
      setNgoState(ngoState === "login" ? "signup" : "login");
    } else if (role === "volunteer") {
      setVolunteerState(volunteerState === "login" ? "signup" : "login");
    }
  };

  return (

    <div className="flex justify-center items-center w-full bg-green-100 animate-fadeIn mt-[-650px]">
      <div className="w-full p-6 bg-green-100 rounded-lg shadow-lg">
        {/* Title and Description */}
        <h1 className="text-5xl font-bold text-center mb-4 text-green-900 flex items-center justify-center">
          <FaMapMarkerAlt className="text-5xl mr-2 text-green-600" />
          Access your dashboard
        </h1>
        <p className="text-2xl text-center mb-8 text-green-600 font-bold my-6">
          Select your role and access specialized features
        </p>

        {/* Login and Sign Up Forms */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">



          <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-green-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FaTractor className="text-5xl mb-4 text-green-600" />
            <h2 className="text-3xl font-semibold mb-4 text-green-800">Volunteers</h2>
            <div className="w-full mb-4">
              <label htmlFor="volunteer-email" className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="email"
                id="volunteer-email"
                className="w-full px-4 py-2 border rounded-lg"
                value={volunteerEmail}
                onChange={(e) => setVolunteerEmail(e.target.value)}  // Bind email state
                placeholder="Enter your email"
              />
            </div>
            {volunteerState === "signup" && (
              <div className="w-full mb-4">
                <label htmlFor="volunteer-username" className="block text-sm font-medium text-black mb-2">Username</label>
                <input
                  type="text"
                  id="volunteer-username"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={volunteerUsername}
                  onChange={(e) => setVolunteerUsername(e.target.value)}  // Bind username state
                  placeholder="Enter your username"
                />
              </div>
            )}
            <div className="w-full mb-4">
              <label htmlFor="volunteer-password" className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                id="volunteer-password"
                className="w-full px-4 py-2 border rounded-lg"
                value={volunteerPassword}
                onChange={(e) => setVolunteerPassword(e.target.value)}  // Bind password state
                placeholder="Enter your password"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
              onClick={volunteerSubmitHandler}  // Trigger the submit handler
            >
              <FaLock className="mr-2 inline" />
              {volunteerState === "login" ? "Login" : "Sign Up"}
            </button>
            <p
              className="text-sm text-black mt-4 cursor-pointer"
              onClick={() => setVolunteerState((prevState) => prevState === "login" ? "signup" : "login")}  // Toggle between login and signup state
            >
              {volunteerState === "login" ? "Not having an account? Click here to register" : "Already have an account? Click here to login"}
            </p>
          </div>



          {/* Retailer Form */}
          <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-green-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FaHotel className="text-5xl mb-4 text-green-600" />
            <h2 className="text-3xl font-semibold mb-4 text-green-800">Restaurants</h2>
            <div className="w-full mb-4">
              <label htmlFor="retailer-email" className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="email"
                id="retailer-email"
                className="w-full px-4 py-2 border rounded-lg"
                value={retailerEmail}
                onChange={(e) => setRetailerEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            {retailerState === "signup" && (
              <div className="w-full mb-4">
                <label htmlFor="retailer-username" className="block text-sm font-medium text-black mb-2">Username</label>
                <input
                  type="text"
                  id="retailer-username"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={retailerUsername}
                  onChange={(e) => setRetailerUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
            )}
            <div className="w-full mb-4">
              <label htmlFor="retailer-password" className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                id="retailer-password"
                className="w-full px-4 py-2 border rounded-lg"
                value={retailerPassword}
                onChange={(e) => setRetailerPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
              onClick={retailerSubmitHandler}  // Trigger the submit handler
            >
              <FaLock className="mr-2 inline" />
              {retailerState === "login" ? "Login" : "Sign Up"}
            </button>
            <p
              className="text-sm text-black mt-4 cursor-pointer"
              onClick={() => setRetailerState((prevState) => prevState === "login" ? "signup" : "login")}  // Toggle between login and signup state
            >
              {retailerState === "login" ? "Not having an account? Click here to register" : "Already have an account? Click here to login"}
            </p>
          </div>
          
          {/* Consumer Form */}
          <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-green-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FaPersonCircleCheck className="text-5xl mb-4 text-green-600" />
            <h2 className="text-3xl font-semibold mb-4 text-green-800">Individual Users</h2>
            <form
              className="w-full"
              onSubmit={(e) => {
                // e.preventDefault();
                submitHandler(e); // Call your form submission handler here
              }}
            >
              <div className="w-full mb-4">
                <label
                  htmlFor="consumer-email"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="consumer-email"
                  value={consumerEmail}
                  onChange={(e) => setConsumerEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              {consumerState === "signup" && (
                <div className="w-full mb-4">
                  <label
                    htmlFor="consumer-username"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    id="consumer-username"
                    value={consumerUsername}
                    onChange={(e) => setConsumerUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter your username"
                  />
                </div>
              )}
              <div className="w-full mb-4">
                <label
                  htmlFor="consumer-password"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Password
                </label>
                <input
                  required
                  type="password"
                  id="consumer-password"
                  value={consumerPassword}
                  onChange={(e) => setConsumerPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                <FaLock className="mr-2 inline" />
                {consumerState === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
            <p
              className="text-sm text-black mt-4 cursor-pointer"
              onClick={() => toggleFormState("consumer")}
            >
              {consumerState === "login"
                ? "Not having an account? Click here to register"
                : "Already have an account? Click here to login"}
            </p>
          </div>


          {/* NGO Form */}
          {/* NGO Form */}
          <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-green-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FaHandsHelping className="text-5xl mb-4 text-green-600" />
            <h2 className="text-3xl font-semibold mb-4 text-green-800">NGOs / Food Banks</h2>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                ngoSubmitHandler(e); // Call the NGO form submission handler here
              }}
            >
              <div className="w-full mb-4">
                <label htmlFor="ngo-email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="ngo-email"
                  value={ngoEmail}
                  onChange={(e) => setNgoEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              {ngoState === "signup" && (
                <div className="w-full mb-4">
                  <label htmlFor="ngo-username" className="block text-sm font-medium text-black mb-2">
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    id="ngo-username"
                    value={ngoUsername}
                    onChange={(e) => setNgoUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter your username"
                  />
                </div>
              )}
              <div className="w-full mb-4">
                <label htmlFor="ngo-password" className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  required
                  type="password"
                  id="ngo-password"
                  value={ngoPassword}
                  onChange={(e) => setNgoPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                <FaLock className="mr-2 inline" />
                {ngoState === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
            <p
              className="text-sm text-black mt-4 cursor-pointer"
              onClick={() => toggleFormState("ngo")}
            >
              {ngoState === "login"
                ? "Not having an account? Click here to register"
                : "Already have an account? Click here to login"}
            </p>
          </div>


        </div>
      </div>
       <ToastContainer />
    </div>
  );
};

export default Login;
