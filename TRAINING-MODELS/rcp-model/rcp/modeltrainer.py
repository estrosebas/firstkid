# train_model.py
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
import joblib

# Rutas
CSV_PATH = r"C:\Users\estro\Desktop\rcp-model\keypoints.csv"
OUT_DIR = r"C:\Users\estro\Desktop\rcp-model\trained"
os.makedirs(OUT_DIR, exist_ok=True)
MODEL_PATH = os.path.join(OUT_DIR, "rcp_keypoints_model.h5")

# ---------- 1) Cargar CSV ----------
print("Cargando CSV:", CSV_PATH)
df = pd.read_csv(CSV_PATH)
print("Shape CSV:", df.shape)

# Última columna = label
if df.columns[-1].lower() != "label":
    df = df.rename(columns={df.columns[-1]: "label"})

# ---------- 2) Limpieza ----------
df = df.dropna(axis=0, how="any")

# ---------- 3) Separar X, y ----------
X = df.drop(columns=["label"]).values.astype(np.float32)
y = df["label"].values.astype(np.int32)
print("X shape:", X.shape, "y shape:", y.shape)

# ---------- 4) Train/Test split ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print("Train:", X_train.shape, y_train.shape, "Test:", X_test.shape, y_test.shape)

# ---------- 5) Normalización ----------
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
joblib.dump(scaler, os.path.join(OUT_DIR, "scaler.save"))
print("Scaler guardado.")

# ---------- 6) Modelo (MLP simple) ----------
input_dim = X_train.shape[1]
model = models.Sequential([
    layers.Input(shape=(input_dim,)),
    layers.Dense(128, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(64, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.25),
    layers.Dense(32, activation="relu"),
    layers.Dense(1, activation="sigmoid")
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)
model.summary()

# ---------- 7) Callbacks ----------
es = callbacks.EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)
mc = callbacks.ModelCheckpoint(MODEL_PATH, monitor="val_loss", save_best_only=True)
tb_dir = os.path.join(OUT_DIR, "tb_logs")
tb = callbacks.TensorBoard(log_dir=tb_dir)

# ---------- 8) Entrenamiento ----------
history = model.fit(
    X_train, y_train,
    validation_split=0.15,
    epochs=200,
    batch_size=32,
    callbacks=[es, mc, tb],
    verbose=2
)

# ---------- 9) Evaluar ----------
loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test loss: {loss:.4f}  Test accuracy: {acc:.4f}")
print("Modelo guardado en:", MODEL_PATH)
