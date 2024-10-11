import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { MdLightMode } from "react-icons/md";
import { BsFillGridFill } from "react-icons/bs";
import { api_base_url,toggleClass } from "../helper";

const Navbar = ({isGridLayout,setIsGridLayout}) => {

  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("isDarkMode") === "true");
  
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    }).then((res) => res.json()).then((data) => {
        if (data.success) {
          setData(data.user);
        } 
        else {
          setError(data.message);
        }
      })
  }, []);

  const logout = ()=>{
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }

  return (
    <>
      <div className="navbar flex  items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
          <img
            className="w-[150px] cursor-pointer"
            src={logo}
            alt="navbarLogo"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link>Home</Link>
          <Link>About</Link>
          <Link>Contact</Link>
          <Link>Services</Link>
          <button onClick={logout} className="btnBlue !bg-red-500 min-w-[120px] ml-2 hover:!bg-red-600">Logout</button>
          <Avatar
            onClick={() => {
              toggleClass(".dropDownNavbar", "hidden");
            }}
            name={data ? data.name : ""}
            size="40"
            round="50%"
            className="ml-2 cursor-pointer"
          />
        </div>

        <div className="absolute hidden dropDownNavbar right-[60px] top-[80px] shadow-lg shadow-black/50 bg-[#1A1919] p-[10px] rounded-lg w-[150px] h-[150px] ">
          <div className="py-[10px] border-b-[1px] border-b-[#fff]">
            <h3 className="text-[17px]" style={{ lineHeight: 1 }}>
              {data ? data.name : ""}
            </h3>
          </div>
          <i
            className="flex items-center gap-3 mt-3 mb-2 cursor-pointer"
            style={{ fontStyle: "normal" }}
          >
            <MdLightMode className="text-[20px]" />
            <p>Light Mode</p>
          </i>
          <i onClick={()=>setIsGridLayout(!isGridLayout)}
            className="flex items-center gap-3 mt-3 mb-2 cursor-pointer"
            style={{ fontStyle: "normal" }}
          >
            <BsFillGridFill className="text-[20px]" />
            <p>{isGridLayout ? "List" : "Grid"} layout</p>
          </i>
        </div>
      </div>
    </>
  );
};
export default Navbar;
