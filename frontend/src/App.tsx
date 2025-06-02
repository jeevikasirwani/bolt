import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home";
import CodeFile from "./pages/CodeFile";
function App(){
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/chat" element={<CodeFile/>}/>
  </Routes>
  </BrowserRouter>
}

export default App;