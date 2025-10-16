import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img, array_to_img, save_img

# Carpetas
input_dir = r"C:\Users\estro\Desktop\rcp-model\nose-model\nariz_sana"  # tus imágenes originales
output_dir = r"C:\Users\estro\Desktop\rcp-model\nose-model\nariz_sana_aumentada"  # carpeta donde se guardarán las aumentadas

os.makedirs(output_dir, exist_ok=True)

# Configuración del aumento de datos
datagen = ImageDataGenerator(
    rotation_range=30,      # rotación aleatoria de hasta 30 grados
    width_shift_range=0.1,  # desplazamiento horizontal
    height_shift_range=0.1, # desplazamiento vertical
    shear_range=0.1,        # corte angular
    zoom_range=0.2,         # zoom aleatorio
    horizontal_flip=True,   # volteo horizontal
    brightness_range=[0.7, 1.3], # brillo aleatorio
    fill_mode='nearest'
)

# Cuántas imágenes quieres generar por original
augment_per_image = 3

for img_file in os.listdir(input_dir):
    img_path = os.path.join(input_dir, img_file)
    img = load_img(img_path)  # carga imagen
    x = img_to_array(img)     # pasa a array
    x = x.reshape((1,) + x.shape)

    i = 0
    for batch in datagen.flow(x, batch_size=1, save_to_dir=output_dir, save_prefix='aug', save_format='jpg'):
        i += 1
        if i >= augment_per_image:
            break

print("✅ Aumento de datos completado")
