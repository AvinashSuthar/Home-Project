import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import History from './pages/History';
import App from './App';
import Layout from './Layout';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
