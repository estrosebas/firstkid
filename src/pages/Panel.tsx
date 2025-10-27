import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { statsService, StatsData } from "../services/stats.service";
import { Users, Activity, TrendingUp, BarChart3 } from "lucide-react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const moduleNames: Record<string, string> = {
  rcp: "RCP",
  nose: "Hemorragia Nasal",
  "burn-skins": "Quemaduras",
};

export default function Panel() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await statsService.getAllStats();

      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || "Error al cargar estadísticas");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Cargando estadísticas...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2 style={{ color: "#cc0033" }}>Error</h2>
        <p>{error}</p>
        <button
          onClick={loadStats}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "linear-gradient(90deg,#CC0033 0%,#0097B2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Prepare chart data
  const usageChartData = {
    labels: stats.usageByModule.map((item) => moduleNames[item.module] || item.module),
    datasets: [
      {
        label: "Usos por Módulo",
        data: stats.usageByModule.map((item) => item.count),
        backgroundColor: [
          "rgba(204, 0, 51, 0.8)",
          "rgba(0, 151, 178, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(204, 0, 51, 1)",
          "rgba(0, 151, 178, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const scoresChartData = {
    labels: stats.averageScores.map((item) => moduleNames[item.module] || item.module),
    datasets: [
      {
        label: "Score Promedio",
        data: stats.averageScores.map((item) => item.average),
        backgroundColor: "rgba(0, 151, 178, 0.8)",
        borderColor: "rgba(0, 151, 178, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>
        Panel de Estadísticas
      </h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <StatCard
          icon={<Users size={32} />}
          title="Total Usuarios"
          value={stats.totalUsers}
          color="#CC0033"
        />
        <StatCard
          icon={<Activity size={32} />}
          title="Total Usos"
          value={stats.totalUsage}
          color="#0097B2"
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          title="Módulos Activos"
          value={stats.usageByModule.length}
          color="#FF9F40"
        />
        <StatCard
          icon={<BarChart3 size={32} />}
          title="Scores Registrados"
          value={stats.averageScores.reduce((sum, item) => sum + item.count, 0)}
          color="#4BC0C0"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 30,
          marginBottom: 40,
        }}
      >
        <ChartCard title="Usos por Módulo">
          <Pie data={usageChartData} />
        </ChartCard>

        <ChartCard title="Score Promedio por Módulo">
          <Bar
            data={scoresChartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Actividad Reciente</h2>
        {stats.recentActivity.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No hay actividad reciente</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Módulo</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Usuario</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((activity, index) => (
                  <tr
                    key={activity.id || index}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: 12 }}>
                      {moduleNames[activity.module] || activity.module}
                    </td>
                    <td style={{ padding: 12, fontSize: 12, opacity: 0.7 }}>
                      {activity.userId.substring(0, 8)}...
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {new Date(activity.timestamp).toLocaleString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 15,
      }}
    >
      <div style={{ color }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
          {title}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: 20 }}>{title}</h3>
      <div style={{ position: "relative", height: 300 }}>{children}</div>
    </div>
  );
}
