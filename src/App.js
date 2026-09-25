import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CashierBeranda from "./pages/Cashier/Beranda";
import ApotekerBeranda from "./pages/Apoteker/Beranda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cashier/beranda" />} />
        <Route path="/cashier/beranda" element={<CashierBeranda />} />
        <Route path="/apoteker/beranda" element={<ApotekerBeranda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;