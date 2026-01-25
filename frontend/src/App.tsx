import { useEffect } from "react";

import "./App.css";
/* import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/clerk-react'; */
import AppRoutes from "./AppRoutes";
import { SidebarNav } from "./shared/components/Sidebar";

function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => console.log(data.status))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("theme") || "light";
      document.documentElement.classList.toggle("dark", theme === "dark");
    };

    applyTheme();
    window.addEventListener("storage", applyTheme)
    return () => {
      window.removeEventListener("storage", applyTheme)
    }
  }, [])

  return (
    <div className="flex h-screen">
      <div>
        <SidebarNav />
      </div>
      <main className="app-container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
