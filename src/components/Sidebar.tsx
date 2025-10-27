import React, { useEffect } from "react";
import { Bandage, Phone, Settings, LogOut, BarChart3 } from "lucide-react";
import "../styles/sidebar.css";
import { useNavigate } from "react-router-dom";
import sidebarLogo from "../assets/figma/sidebar/sidebar_logo.png";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  function go(path: string) {
    try {
      if (onClose) onClose();
    } catch (e) {
      /* ignore */
    }
    navigate(path);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    if (onClose) onClose();
    navigate("/");
  }

  return (
    <div
      className={`app-sidebar ${open ? "open" : ""}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="sidebar-backdrop" onClick={onClose} />
      <aside className="sidebar-panel">
        <div className="sidebar-header">
          <img src={sidebarLogo} alt="logo" />
        </div>
        <nav className="sidebar-nav">
          <a
            className="primary-cta"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("/home");
            }}
          >
            <Bandage size={18} style={{ marginRight: 8 }} />
            Técnicas de Primeros Auxilios
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("/technique/rcp");
            }}
          >
            <Phone size={16} style={{ marginRight: 8 }} />
            Emergencia
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("/panel");
            }}
          >
            <BarChart3 size={16} style={{ marginRight: 8 }} />
            Panel de Estadísticas
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("/settings");
            }}
          >
            <Settings size={16} style={{ marginRight: 8 }} />
            Configuración
          </a>
        </nav>

        <div className="sidebar-footer">
          <a
            className="logout"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <LogOut size={16} style={{ marginRight: 8 }} />
            Cerrar sesión
          </a>
        </div>
      </aside>
    </div>
  );
}
