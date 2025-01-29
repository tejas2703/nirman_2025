import React from 'react';
import { Link } from 'react-router-dom';
import { LuLeaf } from 'react-icons/lu';
import { TbHeartRateMonitor } from "react-icons/tb";
import { SiGoogleanalytics } from "react-icons/si";
import { FaBowlFood } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import { FaArrowRightToBracket } from "react-icons/fa6";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 animate-fadeIn">

<Link to="/daily-price">
        <button className="absolute top-4 right-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <span>Daily Market Price</span>
          <FaArrowRightToBracket className="text-white text-lg" />
        </button>
      </Link>
      
      {/* Header Section */}
      <div className="flex items-center mb-4 absolute top-4 left-4">
        <LuLeaf 
          className="text-green-500 text-8xl mr-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-12" 
        />
        <h1 className="text-7xl font-bold text-green-900">NourishAI</h1>
      </div>
      </div>
     
  );
};

export default Header;
