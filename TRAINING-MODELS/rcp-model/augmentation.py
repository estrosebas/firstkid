import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img

# Ruta de entrada (imágenes originales)
input_dir = r"C:\Users\estro\Desktop\rcp-model\datasests"

# Ruta de salida (imágenes aumentadas)
output_dir = r"C:\Users\estro\Desktop\rcp-model\datasests_augmented"
os.makedirs(output_dir, exist_ok=True)

# Configuración del data augmentation
datagen = ImageDataGenerator(
    rotation_range=40,        # rotaciones más grandes
    width_shift_range=0.2,    # mover más
    height_shift_range=0.2,
    shear_range=0.2,          # distorsiones más fuertes
    zoom_range=0.3,           # zoom in/out
    horizontal_flip=True,
    brightness_range=[0.5, 1.5],  # brillo variable
    channel_shift_range=30.0,     # cambiar colores
    fill_mode='nearest'
)

# Recorremos todas las imágenes originales
for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
        img_path = os.path.join(input_dir, filename)
        img = load_img(img_path, target_size=(224, 224))  
        x = img_to_array(img)
        x = x.reshape((1,) + x.shape)

        # 🔥 Generamos 20 versiones por imagen (ajusta si quieres más/menos)
        i = 0
        for batch in datagen.flow(
            x, 
            batch_size=1,
            save_to_dir=output_dir,
            save_prefix=filename.split('.')[0],
            save_format='jpg'
        ):
            i += 1
            if i >= 20:
                break

print("✅ Augmentation terminado. Revisa la carpeta:", output_dir)
