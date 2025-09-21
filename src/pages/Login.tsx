import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { Mail, Lock } from "lucide-react";
import { validateCredentials, demoAccount } from "../data/accountMock";
import loginLogo from "../assets/figma/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (validateCredentials(email.trim(), password)) {
      const user = { email: demoAccount.email, name: demoAccount.name };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } else {
      setError("Credenciales inválidas. Usa demo@gmail.com / 123");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={loginLogo}
          alt="logo"
          style={{ width: 200, height: 200, objectFit: "cover" }}
        />
      </div>
      <h2 style={{ marginTop: 20 }}>Iniciar sesión</h2>
      <form style={{ marginTop: 20 }} onSubmit={submit}>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Correo electrónico
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mail style={{ marginRight: 8 }} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hola@correo.com"
              style={{ flex: 1, padding: 8, borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Contraseña
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Lock style={{ marginRight: 8 }} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              type="password"
              style={{ flex: 1, padding: 8, borderRadius: 6 }}
            />
          </div>
        </div>

        {error ? (
          <div style={{ color: "#cc0033", marginTop: 12 }}>{error}</div>
        ) : null}

        <div style={{ marginTop: 12 }}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,#CC0033 0%,#0097B2 100%)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Iniciar
          </button>
        </div>
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          opacity: 0.8,
        }}
      >
        <button
          style={{ background: "none", border: "none", color: "#0097B2" }}
        >
          Recuperar cuenta
        </button>
        <button
          style={{ background: "none", border: "none", color: "#0097B2" }}
        >
          ¿No tienes una cuenta?
        </button>
      </div>
    </div>
  );
}
