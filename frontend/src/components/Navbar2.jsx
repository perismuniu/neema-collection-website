import { useState } from "react";
import Logo from "../assets/NeemaCollection-Logo-color_white.svg";
import Cart from "../assets/cart.svg";
import Person from "../assets/person.svg"
import {Link} from "react-router-dom"

const Navbar = () => {
  const [menuVisibility, setMenuVisibilty] = useState(false)

  return (
    <div className="h-14 bg-gray flex flex-row ">
      <Link to="/"><img src={Logo} className="h-14 w-52 relative" /></Link>
      
      <h1 className="text-white mx-auto my-auto">Search</h1>
      <div className="flex flex-row">
        <div className={`relative ${!menuVisibility ? "my-auto" : ""}`}>
        <img src={Person} className="h-10 my-auto cursor-pointer" onClick={() => setMenuVisibilty(!menuVisibility)}/>
        {menuVisibility && (
          <div className="absolute flex flex-col right-0 top-14 bg-gray w-40 text-off-white items-center text-center rounded-br-lg rounded-bl-lg">
            <Link to="/user/profile">Profile</Link>
            <Link to="/user/orders">Orders</Link>
            <Link to="/user/settings">settings</Link>
            <Link to="/user/logout">Logout</Link>
          </div>
        )}
        </div>
        <h1 className="text-white my-auto ml-5">Kshs. 250</h1>
        <img src={Cart} className="h-10 my-auto ml-5 mr-5"/>
      </div>
  
    </div>
  )
}

export default Navbar