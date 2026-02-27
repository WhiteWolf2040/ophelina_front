import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import ClientesVista from "./components/clientesvista";
import EmpeñosVista from "./components/empeñosvista";
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/clientesvista" element={<ClientesVista />} />
      <Route path="/empeñosvista" element={<EmpeñosVista />} />
        <Route path="/" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />
      </Routes>
    </Router>
  );
}

export default App;