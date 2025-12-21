import React from 'react'
import Navbar from './admin/components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AdminHome from './admin/pages/AdminHome'
import FreelancerHome from './freelancer/FreelancerHome'
import Login from './common/Login'
import SetClientPassword from './client/SetClientPassword'
import LandingPage from './common/LandingPage'
import ClientDashboard from './client/ClientDashboard'
import Page404 from './common/Page404'
import Footer from './common/Footer'
import Payment from './common/Payment'
import Contact from './common/Contact'
import AboutUs from './common/AboutUs'
import Subscription from './common/Subscription'
import PaymentSuccess from './common/PaymentSuccess'
import Chat from './common/components/Chat'


function App() {
  const tab = false
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/freelancer' element={<FreelancerHome />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login tab='register'   />} />
        <Route path='/set-password/:email' element={<SetClientPassword />} />
        <Route path='/client' element={<ClientDashboard />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/pricing' element={<Subscription />} />
        <Route path='/success/:projectId' element={<PaymentSuccess />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/*' element={<Page404 />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* <Footer /> */}

    </>
  )
}

export default App