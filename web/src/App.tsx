import { Route, Routes } from "react-router";
import "./App.css";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";

import Particles from "./components/Particles";

function App() {

  return (
    <>

      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Particles/>
    </>
  );
}

export default App;
