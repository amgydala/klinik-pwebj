import { BrowserRouter, Routes, Route } from "react-router-dom";
import CashierBeranda from "./pages/Cashier/Beranda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cashier/beranda" element={<CashierBeranda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;