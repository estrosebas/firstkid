import os
import cv2
import numpy as np
import tensorflow as tf

# Cargar modelo entrenado
model = tf.keras.models.load_model("burn_class_model.h5")

# Función para cargar y preprocesar imagen
def load_and_preprocess(img_path, img_size=(224,224)):
    img = cv2.imread(img_path)
    if img is None:
        return None
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, img_size)
    img = img / 255.0
    return np.expand_dims(img, axis=0)

# Directorios de prueba (elige algunas imágenes aleatorias)
burned_dir = r"C:\Users\estro\Desktop\rcp-model\treain-skin-bourn/quemadas"
healthy_dir = r"C:\Users\estro\Desktop\rcp-model\treain-skin-bourn/sanas"

# Tomar algunas imágenes aleatorias
burned_imgs = np.random.choice(os.listdir(burned_dir), 5, replace=False)
healthy_imgs = np.random.choice(os.listdir(healthy_dir), 5, replace=False)

print("🔴 Probando imágenes quemadas:")
for img_name in burned_imgs:
    img_path = os.path.join(burned_dir, img_name)
    img = load_and_preprocess(img_path)
    if img is None:
        continue
    pred = model.predict(img)[0][0]
    label = "Quemada" if pred > 0.5 else "Sana"
    print(f"{img_name}: {label} ({pred:.2f})")

print("\n🟢 Probando imágenes sanas:")
for img_name in healthy_imgs:
    img_path = os.path.join(healthy_dir, img_name)
    img = load_and_preprocess(img_path)
    if img is None:
        continue
    pred = model.predict(img)[0][0]
    label = "Quemada" if pred > 0.5 else "Sana"
    print(f"{img_name}: {label} ({pred:.2f})")
