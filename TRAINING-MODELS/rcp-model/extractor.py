import os
import csv
import cv2
import mediapipe as mp

# Rutas de las carpetas
base_dir = r"C:\Users\estro\Desktop\rcp-model"
folders = {
    "SI-RCP": 1,   # etiqueta 1
    "NO-RCP": 0    # etiqueta 0
}

output_csv = os.path.join(base_dir, "keypoints.csv")

# Inicializar MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

# Crear CSV con encabezado
num_keypoints = 33
header = []
for i in range(num_keypoints):
    header += [f"x{i}", f"y{i}", f"z{i}", f"v{i}"]
header.append("label")  # etiqueta (RCP=1 / NoRCP=0)

with open(output_csv, mode="w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)

    # Procesar imágenes de ambas carpetas
    for folder_name, label in folders.items():
        folder_path = os.path.join(base_dir, folder_name)
        for filename in os.listdir(folder_path):
            if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
                img_path = os.path.join(folder_path, filename)
                
                # Leer imagen
                image = cv2.imread(img_path)
                if image is None:
                    print(f"⚠️ No se pudo leer {filename}")
                    continue

                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = pose.process(image_rgb)

                if results.pose_landmarks:
                    row = []
                    for lm in results.pose_landmarks.landmark:
                        row += [lm.x, lm.y, lm.z, lm.visibility]
                    row.append(label)
                    writer.writerow(row)
                    print(f"✅ Procesada: {filename}")
                else:
                    print(f"⚠️ No se detectó pose en {filename}")

print("✅ Extracción de keypoints terminada. CSV guardado en:", output_csv)
