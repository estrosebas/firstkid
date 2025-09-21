import React from "react";

export default function FloatingEmergency({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="emergencia"
      style={{
        position: "fixed",
        right: 18,
        bottom: 22,
        width: 64,
        height: 64,
        borderRadius: 32,
        background: "linear-gradient(90deg,#CC0033 0%,#0097B2 100%)",
        border: "none",
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        color: "#fff",
        fontSize: 18,
        cursor: "pointer",
      }}
    >
      ●
    </button>
  );
}
