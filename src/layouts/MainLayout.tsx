import React, { PropsWithChildren, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
