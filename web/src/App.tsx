import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Particles from "./components/Particles";
import DeckPage from "./pages/DeckPage";

function App() {
  return (
    <>
      <div className="particles"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/deck/:id" element={<DeckPage />} />
      </Routes>
      <Particles />
    </>
  );
}

export default App;
