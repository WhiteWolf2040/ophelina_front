import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />
      </Routes>
    </Router>
  );
}

export default App;