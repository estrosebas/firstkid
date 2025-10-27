import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { authService } from "../services/auth.service";
import loginLogo from "../assets/figma/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validations
    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
      });

      if (result.success && result.user) {
        // Navigate to home on successful registration
        navigate("/home");
      } else {
        setError(result.error || "Error al registrar usuario");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
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
      <h2 style={{ marginTop: 20 }}>Crear cuenta</h2>
      <form style={{ marginTop: 20 }} onSubmit={submit}>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Nombre (opcional)
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <User style={{ marginRight: 8 }} />
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ flex: 1, padding: 8, borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Correo electrónico
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mail style={{ marginRight: 8 }} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
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
              type="password"
              required
              style={{ flex: 1, padding: 8, borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Confirmar contraseña
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Lock style={{ marginRight: 8 }} />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
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
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: loading
                ? "#ccc"
                : "linear-gradient(90deg,#CC0033 0%,#0097B2 100%)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 14,
          opacity: 0.8,
        }}
      >
        <Link
          to="/login"
          style={{
            background: "none",
            border: "none",
            color: "#0097B2",
            textDecoration: "none",
          }}
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
}
