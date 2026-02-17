import { useState } from "react";
import Auth from "./Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return loggedIn
    ? <Dashboard onLogout={logout} />
    : <Auth onLogin={() => setLoggedIn(true)} />;
}
