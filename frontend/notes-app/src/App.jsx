import React from 'react'
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom'
// import Home from './pages/Home/Home'
import {Home , Login , SignUp} from './pages'



const routes=(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      </Routes>
  </Router>

)
const App = () => {
  return (

    <>
    {routes}
    
    </>
  )
}

export default App