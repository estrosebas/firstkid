import React from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../components/IconButton";
import "../styles/home.css";
import SearchBar from "../components/SearchBar";
import FloatingEmergency from "../components/FloatingEmergency";
import rcpImg from "../assets/figma/rcp.png";
import rbabImg from "../assets/figma/rbab.png";
import maniobraImg from "../assets/figma/maniobra.png";
import rbanImg from "../assets/figma/rban.png";
import hemoImg from "../assets/figma/hemo.png";
import quemaImg from "../assets/figma/quema.png";

export default function Home() {
  const navigate = useNavigate();
  // Mostrar solo técnicas implementadas: RCP, Hemorragia nasal y Quemaduras
  const buttons = [
    { img: rcpImg, label: "RCP", slug: "rcp" },
    { img: hemoImg, label: "Hemorragia nasal", slug: "hemo" },
    { img: quemaImg, label: "Quemaduras", slug: "quema" },
  ];

  return (
    <div className="container">
      <div className="home-hero center">
        <div className="home-title">Empieza a aprender como salvar vidas</div>
      </div>

      <div className="search-wrap">
        <SearchBar />
      </div>

      <div className="tech-grid">
        {buttons.map((b) => (
          <IconButton
            key={b.label}
            imgSrc={b.img}
            label={b.label}
            onClick={() => {
              if (b.slug) {
                navigate(`/technique/${b.slug}`);
                return;
              }
              if (b.label === "RCP") {
                navigate("/technique/rcp");
              } else {
                alert(b.label);
              }
            }}
          />
        ))}
      </div>

      {/* <FloatingEmergency onClick={() => alert("Emergencia")} /> */}
    </div>
  );
}
