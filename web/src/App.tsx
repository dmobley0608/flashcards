

import { Route, Routes } from 'react-router'
import './App.css'
import Login from './pages/Login'
import Homepage from './pages/Homepage'

function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>

    </>
  )
}

export default App
