import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () => {
    sessionStorage.removeItem("loggedUserDetails")
    sessionStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate('/login')
  }

  useEffect(() => {
    const user = sessionStorage.getItem("loggedUserDetails");
    setIsLoggedIn(!!user);
  }, []);
  return (
    <>
      <div className="w-full py-7 px-12 flex justify-between items-center bg-[#484848]">
        <h1 className='text-3xl font-semibold text-white'>Admin Dashboard</h1>
        {/* Actions */}
        {isLoggedIn ?
          <button onClick={handleLogout} className="px-5 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md hover:bg-white/30 transition duration-300">Logout</button>
          :
          <Link to={'/login'} className="px-5 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md hover:bg-white/30 transition duration-300">Login</Link>
        }


      </div>
    </>
  )
}

export default Navbar