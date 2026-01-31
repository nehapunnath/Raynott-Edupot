import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Header from './Components/Header'
import Footer from './Components/Footer'
import About from './Pages/About'
import Features from './Pages/Features'
import Contact from './Pages/Contact'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/features' element={<Features/>}/>
      <Route path='/contact' element={<Contact/>}/>


    </Routes>
      <Footer/>
    </>
  )
}

export default App
