import React from 'react'
import Header from '../../Components/HomePage/Header'
import Login from '../../Components/Homepage/Login'

const HomePage = () => {
  return (
    <div className="bg-green-100">
      <Header />
      <div className="mt-0 flex justify-center items-center"> {/* Adjusted spacing */}
        <Login />
      </div>
    </div>
  );
};

export default HomePage;
