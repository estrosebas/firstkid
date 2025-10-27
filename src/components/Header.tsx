import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { authService } from "../services/auth.service";
import headerLogo from "../assets/figma/header_logo.png";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="app-header" style={{ padding: "8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          aria-label="menu"
          onClick={() => onMenuClick && onMenuClick()}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 22,
            padding: 8,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src={headerLogo}
            alt="PocketAid"
            style={{ height: 36, objectFit: "contain" }}
          />
        </div>
        <button
          aria-label="logout"
          onClick={handleLogout}
          title="Cerrar sesión"
          style={{
            background: "transparent",
            border: "none",
            padding: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#CC0033",
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
