import os
import cv2
import numpy as np

def load_images(folder_path, label, img_size=(224,224)):
    images = []
    labels = []
    for filename in os.listdir(folder_path):
        path = os.path.join(folder_path, filename)
        img = cv2.imread(path)
        if img is None:
            continue
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, img_size)
        images.append(img / 255.0)  # Normalizar
        labels.append(label)
    return np.array(images), np.array(labels)

burned_dir = r"C:\Users\estro\Desktop\rcp-model\treain-skin-bourn/quemadas"
healthy_dir = r"C:\Users\estro\Desktop\rcp-model\treain-skin-bourn/sanas"

X_burned, y_burned = load_images(burned_dir, 1)
X_healthy, y_healthy = load_images(healthy_dir, 0)

X = np.concatenate([X_burned, X_healthy])
y = np.concatenate([y_burned, y_healthy])
