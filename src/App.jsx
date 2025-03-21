import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Secret from './pages/Secret'
import RetrivePage from "./pages/RetrievePage"
import UploadPage from "./pages/UploadPage"
import NotFound from './pages/NotFound'
const App = () => {
  return (
  
     <BrowserRouter>
     <Routes>
      <Route exact path="/registration" element={<Register />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/" element={<Secret />} />
      <Route exact path="/retrieve/:user" element={<RetrivePage />} />
      <Route exact path="/Upload" element={<UploadPage />} />
      <Route path="*" element={<NotFound />} />
     </Routes>
     </BrowserRouter>
  
  )
}

export default App