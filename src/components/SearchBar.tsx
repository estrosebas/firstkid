import React from "react";

export default function SearchBar({
  placeholder = "Buscar técnica",
}: {
  placeholder?: string;
}) {
  return (
    <div style={{ margin: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 8,
              padding: "10px 12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ marginRight: 8, color: "#9CA3AF" }}>🔍</span>
            <input
              aria-label="buscar"
              placeholder={placeholder}
              style={{ border: "none", outline: "none", flex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
