import { useState } from "react";
import Logo from "../assets/NeemaCollection-Logo-color_white.svg";
import Cart from "../assets/cart.svg";
import Person from "../assets/person.svg"
import {Link, useNavigate} from "react-router-dom"
import { logout } from "../redux/userSlice";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuVisibility, setMenuVisibilty] = useState(false)
  const navigate = useNavigate()
  const token = useSelector(state => state.token)
  const userOptions = [{
    name: "Profile",
    action: "/user/profile"
  },
  {
    name: "Orders",
    action: "/user/orders"
  },
  {
    name: "Settings",
    action: "/user/settings"
  },
  {
    name: "Logout",
    action: "/user/logout"
  }
]
const user = useSelector(state => state.auth.user)

console.log(user)


const handleCartView = () => {
navigate("/user/cart") 
}

  return (
    <div className="h-14 bg-gray flex flex-row ">
      <Link to="/"><img src={Logo} className="h-14 w-52 relative" /></Link>
      
      <h1 className="text-white mx-auto my-auto">Search</h1>
      <div className="flex flex-row">
        <div className={`relative ${!menuVisibility ? "my-auto" : ""}`}>
        <img src={Person} className="h-10 my-auto cursor-pointer" onClick={() => user? setMenuVisibilty(!menuVisibility) : null}/>
        {menuVisibility && (
          <div className="absolute flex flex-col right-0 top-14 bg-gray w-40 text-off-white items-center text-center rounded-br-lg rounded-bl-lg">
            <ul className="w-full">
            {
              userOptions.map((option, index) => (
                  <li to={option.action} className={`text-center w-full hover:bg-gray-light cursor-pointer hover:text-black ${option.name === "Logout"? "mb-3": ""}`} onClick={() => {
                    setMenuVisibilty(false)
                    option.name === "Logout"? logout(token) : navigate(option.action)
                  }} key={index}>{option.name}</li>
              ))
            }
            </ul>
          </div>
        )}
        </div>
        <h1 className="text-white hidden md:flex my-auto ml-5">Kshs. {user? user.wallet : 3000}</h1>
        <div className="relative items-center justify-center flex">
        <img src={Cart} className="h-7 md:h-10 my-auto ml-5 mr-5 cursor-pointer" onClick={()=> handleCartView()}/>
        <div className={`absolute flex flex-col right-2 top-2 bg-red-700 w-4 h-4 text-sm md:right-14 md:w-5 md:h-5 text-off-white items-center text-center rounded-full`}>{user.wallet}</div>
        </div>
      </div>
  
    </div>
  )
}

export default Navbar