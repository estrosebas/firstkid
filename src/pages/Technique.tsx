import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import techniques from "../data/techniques";
import "../styles/technique.css";

// TensorFlow.js is loaded via CDN in index.html; declare global for TypeScript
declare const tf: any;

// RCP Detection Component
function RCPDetector({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Iniciando cámara...");
  const [detection, setDetection] = useState("");
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const poseRef = useRef<any>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Model normalization values from your Python training
  const mean = [
    0.49429448, 0.45390909, -0.25525625, 0.99339057, 0.496996, 0.44511986,
    -0.25930089, 0.99295379, 0.49869768, 0.44430399, -0.25935005, 0.99256293,
    0.50040217, 0.44343102, -0.25945431, 0.99365517, 0.49233805, 0.4449678,
    -0.26320889, 0.99217602, 0.49077029, 0.44406809, -0.26326195, 0.99095407,
    0.48919366, 0.44320127, -0.26335008, 0.99191973, 0.50289987, 0.43666979,
    -0.22183293, 0.99210576, 0.48789519, 0.43707621, -0.23983125, 0.98998183,
    0.49752272, 0.45722693, -0.23385866, 0.99345316, 0.49190391, 0.45686404,
    -0.23919828, 0.99282852, 0.51433766, 0.45930093, -0.17321071, 0.99674796,
    0.47592721, 0.46414842, -0.20031388, 0.99657971, 0.5158636, 0.54718273,
    -0.15943984, 0.62875116, 0.46678614, 0.55648218, -0.19395122, 0.67725902,
    0.5125804, 0.61555421, -0.18295566, 0.63319881, 0.47060535, 0.6241573,
    -0.2093584, 0.67324495, 0.51417098, 0.63061607, -0.20832473, 0.61062376,
    0.46813447, 0.63918628, -0.23561498, 0.64291434, 0.50999929, 0.62920484,
    -0.22435145, 0.61541729, 0.47294076, 0.63667466, -0.25032698, 0.64391246,
    0.50852707, 0.62467316, -0.19102932, 0.60535908, 0.47499509, 0.63185268,
    -0.21695209, 0.63113098, 0.5084692, 0.57201886, 0.00810138, 0.98258,
    0.48173064, 0.57594679, -0.00817299, 0.98301915, 0.5212255, 0.64187125,
    0.04690249, 0.6185649, 0.4755952, 0.65120803, 0.03035075, 0.64858401,
    0.5121995, 0.68390333, 0.25148221, 0.54092054, 0.46793929, 0.69166187,
    0.23175145, 0.5690702, 0.51065726, 0.6869204, 0.27211599, 0.55798809,
    0.46637735, 0.69421359, 0.25351212, 0.57228523, 0.51201105, 0.7021043,
    0.2392435, 0.5734732, 0.4689455, 0.71163505, 0.22280046, 0.59416799,
  ];

  const scale = [
    0.18242164, 0.17713967, 0.28761227, 0.02426073, 0.18742327, 0.18349429,
    0.28834766, 0.02307509, 0.18745969, 0.18379113, 0.28832717, 0.02386756,
    0.1874663, 0.18416115, 0.28835843, 0.02165578, 0.18716517, 0.18383082,
    0.28631803, 0.02359577, 0.18699092, 0.18441069, 0.28636328, 0.02738488,
    0.18684283, 0.1850487, 0.28636204, 0.02569984, 0.1842614, 0.18638332,
    0.28275318, 0.02736559, 0.18320868, 0.18759556, 0.27372589, 0.0358062,
    0.17653642, 0.17269148, 0.27546907, 0.02430211, 0.17624761, 0.17320119,
    0.27253625, 0.02541066, 0.16598914, 0.16836761, 0.29264921, 0.02154496,
    0.1645736, 0.17200274, 0.27918642, 0.02549638, 0.16225148, 0.15633914,
    0.31761171, 0.37631838, 0.1616178, 0.1578483, 0.3047417, 0.35474141,
    0.17240915, 0.17734412, 0.31378021, 0.35269601, 0.17219317, 0.17793925,
    0.31149003, 0.32325324, 0.1797583, 0.18738804, 0.33784478, 0.33908133,
    0.17974154, 0.18795673, 0.33871304, 0.31103974, 0.1787674, 0.18629227,
    0.33063472, 0.33585025, 0.17819433, 0.18762208, 0.3293322, 0.30987995,
    0.1752828, 0.18225243, 0.31081003, 0.32755936, 0.17500514, 0.18328869,
    0.30841417, 0.3001329, 0.17028886, 0.1753793, 0.11911009, 0.10620386,
    0.17133579, 0.17640596, 0.11909012, 0.10529237, 0.17921988, 0.17358613,
    0.24126388, 0.34255948, 0.17747427, 0.17018522, 0.25607708, 0.31560421,
    0.22921931, 0.20177029, 0.31932421, 0.33510086, 0.22514595, 0.1933915,
    0.32286074, 0.32579548, 0.24241537, 0.20888236, 0.33089563, 0.31492072,
    0.23768683, 0.20058264, 0.33476898, 0.29969881, 0.2468586, 0.21774359,
    0.36219872, 0.31192111, 0.24393693, 0.21050056, 0.3644959, 0.30421064,
  ];

  // Initialize camera + model; extracted so it can be reused when switching cameras
  const initializeCamera = async (deviceId?: string | null) => {
    try {
      // Load TensorFlow model
      setStatus("Cargando modelo...");
      //@ts-ignore
      modelRef.current = await tf.loadLayersModel("/tfjs_model-rcp/model.json");
      setStatus("Modelo cargado, iniciando cámara...");

      // Initialize MediaPipe Pose
      //@ts-ignore
      const pose = new Pose({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 1,
        staticImageMode: false,
        minDetectionConfidence: 0.5,
      });

      pose.onResults((results: any) => {
        if (!modelRef.current) return;

        if (!results.poseLandmarks) {
          setDetection(
            "No se ve una postura clara. Muévete un poco para que te detecte mejor."
          );
          return;
        }

        const keypoints: number[] = [];
        results.poseLandmarks.forEach((lm: any) => {
          keypoints.push(lm.x, lm.y, lm.z, lm.visibility);
        });

        if (keypoints.length !== 132) {
          setDetection(
            "Procesando... mueve ligeramente la cámara o espera un momento."
          );
          return;
        }

        const keypoints_scaled = keypoints.map(
          (v, i) => (v - mean[i]) / scale[i]
        );
        //@ts-ignore
        const input = tf.tensor2d([keypoints_scaled]);
        const prediction = modelRef.current.predict(input);

        prediction.data().then((probArr: Float32Array) => {
          const prob = probArr[0];
          // Friendlier messages
          if (prob > 0.7) {
            setDetection(
              `¡Bien hecho! Parece que estás aplicando RCP correctamente (${(
                prob * 100
              ).toFixed(0)}%)`
            );
          } else if (prob > 0.4) {
            setDetection(
              `Casi — ajusta la postura o la fuerza y prueba de nuevo (${(
                prob * 100
              ).toFixed(0)}%)`
            );
          } else {
            setDetection(
              `Necesita práctica: intenta mejorar la posición y compresión (${(
                prob * 100
              ).toFixed(0)}%)`
            );
          }
        });
      });

      poseRef.current = pose;

      // Get camera stream (use deviceId if provided)
      const videoConstraints: any = { width: 640, height: 480 };
      if (deviceId) {
        videoConstraints.deviceId = { exact: deviceId };
      } else {
        // prefer environment (rear) camera if available
        videoConstraints.facingMode = { ideal: "environment" };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });
      streamRef.current = stream;

      // Enumerate devices (labels available after permission)
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "videoinput"));
        // set selected device from stream settings if available
        const track = stream.getVideoTracks()[0];
        // @ts-ignore
        const settings = track.getSettings ? track.getSettings() : {};
        if (settings && settings.deviceId) {
          setSelectedDeviceId(settings.deviceId as string);
        }
      } catch (e) {
        console.warn("Could not enumerate devices:", e);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }

      setStatus("✅ Listo — mostrando resultados en vivo");
      setIsActive(true);

      // Start processing frames every 1 second
      intervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current && poseRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Send frame to MediaPipe
            poseRef.current.send({ image: canvas });
          }
        }
      }, 1000); // Every 1 second
    } catch (error) {
      console.error("Error initializing camera:", error);
      setStatus("❌ Error al acceder a la cámara");
    }
  };

  useEffect(() => {
    // start with selectedDeviceId (may be null)
    initializeCamera(selectedDeviceId);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch camera by deviceId
  const switchCamera = async (deviceId: string) => {
    // stop existing stream and interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const s = videoRef.current.srcObject as MediaStream;
      s.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }

    setStatus("Cambiando cámara...");
    try {
      // Reinitialize camera with chosen device
      await initializeCamera(deviceId);
      setSelectedDeviceId(deviceId);
    } catch (e) {
      console.error("Error switching camera:", e);
      setStatus("❌ No se pudo cambiar la cámara");
    }
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="rcp-detector-overlay">
      <div className="rcp-detector-modal">
        <div className="rcp-detector-header">
          <h3>Detección de RCP</h3>
          <button onClick={handleClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="rcp-detector-content">
          <div className="camera-container">
            {/* Camera selector */}
            {devices.length > 1 && (
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <label style={{ marginRight: 8, color: "#334155" }}>
                  Cámara:
                </label>
                <select
                  value={selectedDeviceId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) switchCamera(id);
                  }}
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Cámara ${d.deviceId}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          <div className="detection-status">
            <div className="status-text">{status}</div>
            {isActive && <div className="detection-result">{detection}</div>}
          </div>

          <div className="detection-info">
            <p>
              📹 La cámara captura un frame cada 1 segundo para analizar tu
              técnica de RCP.
            </p>
            <p>
              💡 Asegúrate de estar bien iluminado y en una posición clara para
              obtener mejores resultados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skin/Burn Detection Component
function SkinDetector({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Iniciando cámara...");
  const [result, setResult] = useState("");
  const intervalRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const loadModel = async () => {
    try {
      setStatus("Cargando modelo de piel...");
      // @ts-ignore (global tf injected via script)
      modelRef.current = await tf.loadLayersModel(
        "/tfjs_model-skin/model.json"
      );
      setStatus("Modelo cargado, iniciando cámara...");
    } catch (e) {
      console.error("Error cargando modelo de piel:", e);
      setStatus("❌ No se pudo cargar el modelo de piel");
    }
  };

  const initializeCamera = async (deviceId?: string | null) => {
    try {
      // get stream
      const videoConstraints: any = { width: 640, height: 480 };
      if (deviceId) videoConstraints.deviceId = { exact: deviceId };
      else videoConstraints.facingMode = { ideal: "environment" };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });
      streamRef.current = stream;

      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "videoinput"));
        const track = stream.getVideoTracks()[0];
        // @ts-ignore
        const settings = track.getSettings ? track.getSettings() : {};
        if (settings && settings.deviceId)
          setSelectedDeviceId(settings.deviceId as string);
      } catch (e) {
        console.warn("No se pudieron enumerar dispositivos:", e);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }

      setStatus("✅ Listo — analizando piel en vivo");

      // Start interval: capture every 1s
      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || !modelRef.current)
          return;
        const off = canvasRef.current;
        const v = videoRef.current;
        const ctx = off.getContext("2d");
        if (!ctx) return;
        // draw video frame to offscreen canvas sized to model input
        off.width = 224;
        off.height = 224;
        // draw centered/resized
        ctx.drawImage(v, 0, 0, off.width, off.height);

        try {
          // @ts-ignore
          const imgTensor = tf.browser
            .fromPixels(off)
            .toFloat()
            .div(tf.scalar(255))
            .expandDims(0);
          // model predicts probability of burned class in [0,1]
          const pred = await modelRef.current.predict(imgTensor).data();
          const p = pred[0];
          if (p > 0.5) {
            setResult(`🔴 Probable quemadura (${(p * 100).toFixed(0)}%)`);
          } else {
            setResult(
              `🟢 Piel sana (${((1 - p) * 100).toFixed(0)}% confianza)`
            );
          }
          // dispose
          // @ts-ignore
          imgTensor.dispose && imgTensor.dispose();
        } catch (e) {
          console.error("Error en predicción de piel:", e);
        }
      }, 1000);
    } catch (e) {
      console.error("Error inicializando cámara (piel):", e);
      setStatus("❌ Error al acceder a la cámara");
    }
  };

  useEffect(() => {
    loadModel().then(() => initializeCamera(selectedDeviceId));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = async (deviceId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStatus("Cambiando cámara...");
    await initializeCamera(deviceId);
    setSelectedDeviceId(deviceId);
  };

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onClose();
  };

  return (
    <div className="rcp-detector-overlay">
      <div className="rcp-detector-modal">
        <div className="rcp-detector-header">
          <h3>Detección de quemaduras</h3>
          <button onClick={handleClose} className="close-btn">
            ×
          </button>
        </div>
        <div className="rcp-detector-content">
          <div className="camera-container">
            {devices.length > 1 && (
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <label style={{ marginRight: 8, color: "#334155" }}>
                  Cámara:
                </label>
                <select
                  value={selectedDeviceId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) switchCamera(id);
                  }}
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Cámara ${d.deviceId}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          <div className="detection-status">
            <div className="status-text">{status}</div>
            <div className="detection-result">{result}</div>
          </div>

          <div className="detection-info">
            <p>
              📹 La cámara captura un frame cada 1 segundo para clasificar la
              piel.
            </p>
            <p>
              💡 Mantén buena iluminación y distancia constante sobre la lesión.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function YouTubeThumb({ url, title }: { url: string; title: string }) {
  // extract video id naive
  const idMatch = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
  const id = idMatch ? idMatch[1] : null;
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;

  return (
    <div className="video-wrap">
      {thumb ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="video-link"
        >
          <div
            className="video-thumb"
            style={{ backgroundImage: `url(${thumb})` }}
          >
            <div className="video-play">▶</div>
          </div>
        </a>
      ) : (
        <div className="video-placeholder">Video</div>
      )}
      <div className="video-caption">{title}</div>
    </div>
  );
}

// Nose Bleeding Detection Component
function NoseDetector({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Iniciando cámara...");
  const [result, setResult] = useState("");
  const intervalRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const loadModel = async () => {
    try {
      setStatus("Cargando modelo de hemorragia nasal...");
      // @ts-ignore (global tf injected via script)
      // user-provided model folder uses underscore in public: tfjs_model_nose
      modelRef.current = await tf.loadLayersModel(
        "/tfjs_model-nose/model.json"
      );
      setStatus("Modelo cargado, iniciando cámara...");
    } catch (e) {
      console.error("Error cargando modelo de nariz:", e);
      setStatus("❌ No se pudo cargar el modelo de hemorragia nasal");
    }
  };

  const initializeCamera = async (deviceId?: string | null) => {
    try {
      // get stream
      const videoConstraints: any = { width: 640, height: 480 };
      if (deviceId) videoConstraints.deviceId = { exact: deviceId };
      else videoConstraints.facingMode = { ideal: "environment" };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });
      streamRef.current = stream;

      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "videoinput"));
        const track = stream.getVideoTracks()[0];
        // @ts-ignore
        const settings = track.getSettings ? track.getSettings() : {};
        if (settings && settings.deviceId)
          setSelectedDeviceId(settings.deviceId as string);
      } catch (e) {
        console.warn("No se pudieron enumerar dispositivos:", e);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }

      setStatus("✅ Listo — analizando nariz en vivo");

      // Start interval: capture every 1s
      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || !modelRef.current)
          return;
        const off = canvasRef.current;
        const v = videoRef.current;
        const ctx = off.getContext("2d");
        if (!ctx) return;
        // draw video frame to offscreen canvas sized to model input
        off.width = 224;
        off.height = 224;
        // draw centered/resized
        ctx.drawImage(v, 0, 0, off.width, off.height);

        try {
          // @ts-ignore
          const imgTensor = tf.browser
            .fromPixels(off)
            .toFloat()
            .div(tf.scalar(255))
            .expandDims(0);
          // model predicts probability of bleeding class in [0,1]
          const pred = await modelRef.current.predict(imgTensor).data();
          const p = pred[0];
          if (p > 0.5) {
            setResult(`🔴 Nariz con sangre (${(p * 100).toFixed(0)}%)`);
          } else {
            setResult(
              `🟢 Nariz sana (${((1 - p) * 100).toFixed(0)}% confianza)`
            );
          }
          // dispose
          // @ts-ignore
          imgTensor.dispose && imgTensor.dispose();
        } catch (e) {
          console.error("Error en predicción de nariz:", e);
        }
      }, 1000);
    } catch (e) {
      console.error("Error inicializando cámara (nariz):", e);
      setStatus("❌ Error al acceder a la cámara");
    }
  };

  useEffect(() => {
    loadModel().then(() => initializeCamera(selectedDeviceId));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = async (deviceId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStatus("Cambiando cámara...");
    await initializeCamera(deviceId);
  };

  return (
    <div className="rcp-detector-overlay">
      <div className="rcp-detector-modal">
        <div className="rcp-detector-header">
          <h3>🩸 Detección de Hemorragia Nasal</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="rcp-detector-content">
          <div className="camera-container">
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
              style={{ width: 320, height: 240 }}
            />

            {devices.length > 1 && (
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <label style={{ marginRight: 8, color: "#334155" }}>
                  Cámara:
                </label>
                <select
                  value={selectedDeviceId || ""}
                  onChange={(e) => switchCamera(e.target.value)}
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Cámara ${device.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          <div className="detection-status">
            <div className="status-text">{status}</div>
            <div className="detection-result">{result}</div>
          </div>

          <div className="detection-info">
            <p>
              🩸 La cámara analiza cada segundo si hay signos de hemorragia
              nasal.
            </p>
            <p>
              💡 Posiciona la nariz cerca de la cámara con buena iluminación
              para mejores resultados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Technique() {
  const { slug } = useParams();
  const tech = slug ? techniques[slug] : null;
  const [showRCPDetector, setShowRCPDetector] = useState(false);
  const [showSkinDetector, setShowSkinDetector] = useState(false);
  const [showNoseDetector, setShowNoseDetector] = useState(false);

  if (!tech) {
    return (
      <div className="container">
        <h2>Contenido no disponible</h2>
        <p>Esta técnica aún no está implementada. Vuelve pronto.</p>
      </div>
    );
  }

  const handleStartPractice = () => {
    console.log("handleStartPractice called, slug=", slug);
    if (slug === "rcp") {
      setShowRCPDetector(true);
      return;
    }

    if (slug === "quema") {
      setShowSkinDetector(true);
      return;
    }

    if (slug === "hemo") {
      setShowNoseDetector(true);
      return;
    }

    // For other techniques, use the original href
    if (tech.action?.href) {
      window.location.href = tech.action.href;
    }
  };

  return (
    <div className="container technique-page">
      {/* top: clickable video */}
      {tech.videoUrl && <YouTubeThumb url={tech.videoUrl} title={tech.title} />}

      <div className="title-center">
        <h1>{tech.title}</h1>
      </div>

      <div className="collapsible">
        <button className="collapsible-toggle">
          {tech.howToApply?.title ?? "Cómo aplicarlo?"}
        </button>
        <div className="collapsible-body">
          <p>Se debe aplicar en una emergencia cardiaca como:</p>
          <ul>
            {(tech.howToApply?.reasons || []).map((r: string, idx: number) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>

          <h4 className="symptoms-title">{tech.howToApply?.symptomsTitle}</h4>

          <div className="symptom-row">
            {(tech.howToApply?.symptoms || []).map((s: any) => (
              <SymptomCard key={s.id} symptom={s} />
            ))}
          </div>
        </div>
      </div>

      <div className="tech-steps">
        {tech.steps.map((s: any, i: number) => (
          <div className="tech-step" key={i}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      {/* sticky action button bottom-right */}
      {tech.action && (
        <button
          className="sticky-action"
          onClick={handleStartPractice}
          style={{
            background: "linear-gradient(90deg,#CC0033 0%,#0097B2 100%)",
            border: "none",
            cursor: "pointer",
          }}
        >
          {tech.action.label}
        </button>
      )}

      {/* RCP Detector Modal */}
      {showRCPDetector && (
        <RCPDetector onClose={() => setShowRCPDetector(false)} />
      )}

      {/* Skin Detector Modal */}
      {showSkinDetector && (
        <SkinDetector onClose={() => setShowSkinDetector(false)} />
      )}

      {/* Nose Detector Modal */}
      {showNoseDetector && (
        <NoseDetector onClose={() => setShowNoseDetector(false)} />
      )}
    </div>
  );
}

function SymptomCard({ symptom }: { symptom: any }) {
  const [flipped, setFlipped] = React.useState(false);
  return (
    <button
      className={`symptom-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
    >
      <div className="symptom-card-inner">
        <div className="symptom-front">
          <img src={symptom.img} alt={symptom.label} />
          <div className="symptom-label">{symptom.label}</div>
        </div>
        <div className="symptom-back">
          <div className="symptom-details">{symptom.details}</div>
        </div>
      </div>
    </button>
  );
}
