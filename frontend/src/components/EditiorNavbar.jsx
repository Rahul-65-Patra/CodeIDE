import React from 'react'
//import logo from "../images/logo.png"

// import { FiDownload } from "react-icons/fi";

const EditiorNavbar = () => {
  return (
    <>
    <div className='EditorNavbar flex  items-center justify-between px-[100px] h-[80px] bg-[#141414]'>
      <div className="logo">
        {/* <img className='w-[150px] cursor-pointer' src={logo} alt="EditorNavbarLogo" /> */}
        <h1 class=" w-[200px] text-4xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-white-500 to-pink-500 drop-shadow-lg">
            WebForge
          </h1>
      </div>
      {/* <p>File /<span className='text-[gray]'>My first Project</span></p> */}
     {/* <i className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FiDownload/></i> */}
    </div>
    </>
  )
}
export default EditiorNavbar;