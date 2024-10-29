import React from 'react'
import noPage from "../images/404.jpg"
const NoPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img 
        className="w-full max-w-md rounded-lg shadow-lg md:max-w-lg lg:max-w-xl" 
        src={noPage} 
        alt="404 Not Found" 
      />
    </div>
  )
}  

export default NoPage 