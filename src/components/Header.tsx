import React from "react";
import headerLogo from "../assets/figma/header_logo.png";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
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
        <div style={{ width: 40 }} />
      </div>
    </header>
  );
}
