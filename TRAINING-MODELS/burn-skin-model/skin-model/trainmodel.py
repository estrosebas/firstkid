import os
import cv2
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split

# ---------- Cargar imágenes ----------
def load_images(folder_path, label, img_size=(224,224)):
    images, labels = [], []
    files = os.listdir(folder_path)
    print(f"📂 Cargando {len(files)} imágenes de {folder_path}")
    for i, f in enumerate(files,1):
        path = os.path.join(folder_path, f)
        img = cv2.imread(path)
        if img is None: 
            print(f"⚠️ {f} no cargada")
            continue
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, img_size)
        # --- Aquí puedes hacer augmentation manual ---
        images.append(img / 255.0)
        labels.append(label)
        if i % 100 == 0 or i == len(files):
            print(f"  ✅ {i}/{len(files)} imágenes cargadas")
    return np.array(images), np.array(labels)

burned_dir = "C:/Users/estro/Desktop/rcp-model/treain-skin-bourn/quemadas"
healthy_dir = "C:/Users/estro/Desktop/rcp-model/treain-skin-bourn/sanas"

X_burned, y_burned = load_images(burned_dir, 1)
X_healthy, y_healthy = load_images(healthy_dir, 0)

X = np.concatenate([X_burned, X_healthy])
y = np.concatenate([y_burned, y_healthy])
print(f"✅ Total imágenes: {len(X)}")

# ---------- Separar dataset ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# ---------- Modelo ----------
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224,224,3), include_top=False, weights='imagenet'
)
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# ---------- Entrenar ----------
history = model.fit(X_train, y_train, validation_split=0.2, epochs=15, batch_size=32)

# ---------- Guardar para TFJS (.keras) ----------
# model.save("burn_class_model_tfjs.keras")
model.save("burn_class_model_tfjs.h5")
print("💾 Guardado en formato .keras listo para TFJS")

# ---------- Evaluar ----------
loss, acc = model.evaluate(X_test, y_test)
print(f"🎯 Test Accuracy: {acc*100:.2f}%")
