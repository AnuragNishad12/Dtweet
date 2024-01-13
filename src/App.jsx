import React from 'react'
import Register from './Components/Register'
import Home from './Components/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alldata from './Components/Alldata';

function App() {
  return (
    <>
     <Router>
      <Routes>
      <Route exact path="/" element={<Register/>}/>
      <Route path="/Home" element={<Home/>} />
      <Route path="/UserData" element={<Alldata/>} />
      </Routes>
    </Router>
   
    </>
  )
}

export default App
