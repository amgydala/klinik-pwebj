import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Cashier
import CashierBeranda from "./pages/Cashier/Beranda";
import RiwayatBilling from "./pages/Cashier/RiwayatBilling";
import TagihanBaru from "./pages/Cashier/TagihanBaru";

// Apoteker
import ApotekerBeranda from "./pages/Apoteker/Beranda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cashier/beranda" />} />

        {/* Cashier */}
        <Route path="/cashier/beranda" element={<CashierBeranda />} />
        <Route path="/cashier/riwayat-billing" element={<RiwayatBilling />} />
        <Route path="/cashier/tagihan-baru" element={<TagihanBaru />} />

        {/* Apoteker */}
        <Route path="/apoteker/beranda" element={<ApotekerBeranda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;