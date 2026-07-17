import { Route, Routes } from "react-router";
import AuthenticationPage from "./pages/AuthenticationPage";
import HomePage from "./pages/HomePage";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthenticationPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}
