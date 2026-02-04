import { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Header from './Components/Header'
import Footer from './Components/Footer'
import About from './Pages/About'
import Features from './Pages/Features'
import Contact from './Pages/Contact'
import AdminDashboard from './Pages/AdminDashboard'
import { GiToaster } from 'react-icons/gi'
import { ToastContainer } from 'react-toastify'

function App() {
   const location = useLocation();

  const hideHeaderFooterRoutes = ['/login','/dashboard','/admin/dashboard' ];

  const shouldHide = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
    {!shouldHide && <Header />}
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/features' element={<Features/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>



    </Routes>
    <ToastContainer
       position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />
        
       {!shouldHide && <Footer />}
    </>
  )
}

export default App
